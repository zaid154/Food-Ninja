/**
 * Windows-only helper: Parcel's native (.node) modules are compiled with MSVC
 * and depend on VCRUNTIME140.dll. If the Visual C++ Redistributable is not
 * installed system-wide, loading them fails with ERR_DLOPEN_FAILED
 * ("The specified module could not be found").
 *
 * Node searches a .node file's OWN folder for its dependent DLLs, so this
 * script finds an existing x64 VCRUNTIME140.dll already present on the machine
 * (shipped by Edge, OneDrive, VS Code, etc.) and copies it next to each Parcel
 * native module. No admin rights and no VC++ install required.
 *
 * Runs automatically via the "postinstall" npm script. It is a no-op on
 * non-Windows platforms and never fails the install.
 */
const fs = require("fs");
const path = require("path");

function log(msg) {
  console.log(`[fix-native-dll] ${msg}`);
}

try {
  if (process.platform !== "win32") process.exit(0);

  const DLL = "vcruntime140.dll";
  const root = path.join(__dirname, "..", "node_modules");
  if (!fs.existsSync(root)) process.exit(0);

  // Read the PE "Machine" field to confirm a DLL is x64 (0x8664).
  function isX64(file) {
    try {
      const fd = fs.openSync(file, "r");
      const buf = Buffer.alloc(4);
      fs.readSync(fd, buf, 0, 4, 0x3c);
      const peOff = buf.readUInt32LE(0);
      const m = Buffer.alloc(2);
      fs.readSync(fd, m, 0, 2, peOff + 4);
      fs.closeSync(fd);
      return m.readUInt16LE(0) === 0x8664;
    } catch {
      return false;
    }
  }

  // Candidate locations where a good x64 vcruntime140.dll commonly exists.
  const candidates = [
    path.join(process.env.SystemRoot || "C:\\Windows", "System32", DLL),
    ...(function () {
      const out = [];
      const bases = [
        process.env.LOCALAPPDATA &&
          path.join(process.env.LOCALAPPDATA, "Microsoft", "OneDrive"),
        "C:\\Program Files (x86)\\Microsoft\\Edge\\Application",
        "C:\\Program Files\\Microsoft\\Edge\\Application",
      ].filter(Boolean);
      for (const b of bases) {
        try {
          for (const entry of fs.readdirSync(b)) {
            out.push(path.join(b, entry, DLL));
          }
        } catch {
          /* ignore */
        }
      }
      return out;
    })(),
  ];

  const source = candidates.find((p) => {
    try {
      return fs.existsSync(p) && isX64(p);
    } catch {
      return false;
    }
  });

  if (!source) {
    log(
      `No x64 ${DLL} found on this machine. If 'npm run dev' fails with ` +
        `ERR_DLOPEN_FAILED, install the Microsoft Visual C++ Redistributable (x64).`
    );
    process.exit(0);
  }

  // Find every native module that imports VCRUNTIME140.dll and drop the DLL beside it.
  function walk(dir, acc) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return acc;
    }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full, acc);
      else if (e.isFile() && e.name.endsWith(".node")) acc.push(full);
    }
    return acc;
  }

  let patched = 0;
  for (const nodeFile of walk(root, [])) {
    let needs = false;
    try {
      needs = /vcruntime140\.dll/i.test(fs.readFileSync(nodeFile, "latin1"));
    } catch {
      continue;
    }
    if (!needs) continue;
    const dest = path.join(path.dirname(nodeFile), DLL);
    try {
      if (!fs.existsSync(dest)) {
        fs.copyFileSync(source, dest);
        patched++;
      }
    } catch {
      /* ignore */
    }
  }

  log(
    patched > 0
      ? `Copied ${DLL} next to ${patched} native module(s). Parcel should start cleanly.`
      : `All native modules already have ${DLL}. Nothing to do.`
  );
} catch (err) {
  // Never break the install because of this helper.
  log(`skipped (${err && err.message ? err.message : err})`);
}
process.exit(0);

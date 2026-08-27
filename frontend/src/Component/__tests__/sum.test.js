import sum from "../sum"

test("Check sum of 2 numbers",()=>{
   const res =  sum(2,3)

   expect(res).toBe(5)
})  
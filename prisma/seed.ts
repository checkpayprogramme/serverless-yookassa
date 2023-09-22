import  prisma  from '../src/db'


async function main() {
  
  const alice = await prisma.user.create({
  
    data: {
      email: 'alice@prisma.io',
      username: 'Alice',
      first_name:"Alice",
      last_name:"Admonish",
      password:"testPass",
      phone_user:"+700000000",
      middle_name:'', 
      date_birth: new Date('05/09/1982'), 
      phone_additional:'', 
      link_to_profile:'', 
      bio:''
    
    },
  })
  
  const bob = await prisma.user.create({
   
    data: {
      email: 'bob@prisma.io',
      username: 'Bob',
      first_name:"BobName",
      last_name:"BobAdmonish",
      password:"testPass",
      phone_user:"+700000000",
      middle_name:'', 
      date_birth: new Date('05/09/1982'), 
      phone_additional:'', 
      link_to_profile:'', 
      bio:''
    },
  })
  console.log("◭ ✔ 🌱  The seed command has been executed.",{ alice, bob })
  };


main()
  .then(async () => {
    await prisma.$disconnect()
    console.log("Data seeded...");
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    // process.exit(1)
  })
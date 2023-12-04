import * as Argon2 from 'argon2'

if (process.argv[1]) {
  console.log(await Argon2.hash(process.argv[1]))
} else {
  console.log(`usage: ${process.argv[0]} <passwd> `)
}

import RandomString from 'randomstring'

/**
 * This script is used to generate quickly JWT secret for development only
 * 
 * DO NOT USE IN PRODUCTION !!
 */

console.warn(' ______________________________________________________________')
console.warn('|                                                              |')
for (let i = 0; i < 4; i++) {
  console.warn('| DO NOT USE THIS SCRIPT TO GENERATE PRODUCTION GRADE SECRET ! |')
}
console.warn('|______________________________________________________________|')

console.log()
console.info('>> GENERATED DEVELOPMENT SECRET (length = 64)')
console.log()

console.info(
  RandomString.generate({
    charset: 'alphanumeric',
    length: 64
  })
)
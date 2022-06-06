// import Dynamo from './API_Dynamodb';
const words = require('an-array-of-english-words'); // this library requires javascript-style import


export default async (number: string): Promise<string[]> => {
  // let vanityList: string[] = await checkNumber(number, dynamoClient);

  // if (vanityList) {
  //     //if the vanityList is already in the database, return it
  //     return vanityList;
  // }

  let vanityList = [];

  const firstSix = number.slice(0, 6);
  const lastFour = number.slice(6).split('');

  const dialPadMap = new Map([
      ['0', '0'],
      ['1', '1'],
      ['2', 'ABC'],
      ['3', 'DEF'],
      ['4', 'GHI'],
      ['5', 'JKL'],
      ['6', 'MNO'],
      ['7', 'PQRS'],
      ['8', 'TUV'],
      ['9', 'WXYZ'],
  ]);

  const spotOneStr = dialPadMap.get(lastFour[0]).split('');
  const spotTwoStr = dialPadMap.get(lastFour[1]).split('');
  const spotThreeStr = dialPadMap.get(lastFour[2]).split('');
  const spotFourStr = dialPadMap.get(lastFour[3]).split('');

  for (let i = 0; i < spotOneStr.length; i++) {
      if (vanityList.length >= 10) {
          // list already contains 5 words
          break;
      }

      for (let j = 0; j < spotTwoStr.length; j++) {
          if (vanityList.length >= 10) {
              // list already contains 5 words
              break;
          }

          for (let k = 0; k < spotThreeStr.length; k++) {
              if (vanityList.length >= 10) {
                  // list already contains 5 words
                  break;
              }

              for (let m = 0; m < spotFourStr.length; m++) {
                  if (vanityList.length >= 10) {
                      // list already contains 5 words
                      break;
                  }

                  const phoneWord = spotOneStr[i] + spotTwoStr[j] + spotThreeStr[k] + spotFourStr[m];
                  const vanityNumber = firstSix + phoneWord;
                  if (vanityList.length < 5) {
                      // take the first 5 permutations (or fewer if lastFour is e.g. 1111)
                      vanityList.push(vanityNumber);
                  } else if (words.includes(phoneWord.toLowerCase())) {
                      // will add up to the first five matches in the dictionary
                      vanityList.push(vanityNumber);
                  }
              }
          }
      }
  }

  vanityList = vanityList.slice(-5); //only consider the last 5 (or fewer) elements added

  console.log('Generated vanity numbers! Saving to db: ' + vanityList);
  
  return vanityList;
};
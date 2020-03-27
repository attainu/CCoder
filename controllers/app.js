var arr = [
    {
        "_id": "5e7cf24009839b7647df94bc",
        "code": "function hello(args){console.log(args)}",
        "score": 10,
        "challenge": "5e7b89b120b16a176335b821",
        "user": "5e7ce58338c69d678b17340b",
        "language": "python",
        "createdAt": "2020-03-26T18:19:44.731Z",
        "updatedAt": "2020-03-26T18:19:44.731Z",
        "__v": 0
    },
    {
        "_id": "5e7cf2b709839b7647df94bf",
        "code": "function world(args){console.log(args)}",
        "score":11,
        "challenge": "5e7b89b120b16a176335b821",
        "user": "5e7ce58338c69d678b17340b",
        "language": "python",
        "createdAt": "2020-03-26T18:21:43.943Z",
        "updatedAt": "2020-03-26T18:21:43.943Z",
        "__v": 0
    },
    {
        "_id": "5e7cf33f62043676e35bd19d",
        "code": "function world(args){console.log(args)}",
        "score": 0,
        "challenge": "5e7b89b120b16a176335b821",
        "user": "5e7ce58338c69d678b17340b",
        "language": "python",
        "createdAt": "2020-03-26T18:23:59.873Z",
        "updatedAt": "2020-03-26T18:23:59.873Z",
        "__v": 0
    },
    {
        "_id": "5e7cf3e862043676e35bd19e",
        "code": "function world(args){console.log(args)}",
        "score": 10,
        "challenge": "5e7b89b120b16a176335b821",
        "user": "5e7ce58338c69d678b17340b",
        "language": "node",
        "createdAt": "2020-03-26T18:26:48.044Z",
        "updatedAt": "2020-03-26T18:26:48.044Z",
        "__v": 0
    }
]

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
}
// const pets = [
//     {type:"Dog", name:"Spot"},
//     {type:"Cat", name:"Tiger"},
//     {type:"Dog", name:"Rover"}, 
//     {type:"Cat", name:"Leo"}
// ];
var score = 0
    var grouped = groupBy(arr, pet => pet.user);
    // for(i=0;i<grouped.get('5e7ce58338c69d678b17340b').length;i++){
    //     console.log(grouped.get('5e7ce58338c69d678b17340b')[i])
    //     score = score + grouped.get('5e7ce58338c69d678b17340b')[i].score
    // }

    console.log(grouped)
    console.log(score)

    
// console.log(grouped.get("Dog")); 

onmessage= function(e){
	let word1=e.data[0], word2=e.data[1], word3=e.data[2], timeout=e.data[3];
	
	let startTime=Date.now(); //I tried performance.now() as well but it was too slow to call repeatedly
	
	let counter=0; //tracks the number of iterations done
	let success=false;
	let elapsedTime=0;
	do{
		counter++;
		let output=check(word1,word2,word3);
		
		if(output.result){
			postMessage([{type:"success",result:output}]);
			success=true;
			break;
		}else{
			if(elapsedTime%50==0) //the scanter the progress reporting, the higher the no. of iterations that can be achieved(upto a point), I've observed
				postMessage([{type:"progress",iteration:counter,timeElapsed:elapsedTime}]);
		}
		elapsedTime=Date.now()-startTime;
	} while(elapsedTime<timeout);
	
	if(!success){
		postMessage([{type:"failure"}]);
	}
}


function check(word1,word2,word3){
	let uniqueLetters=[];
	let uniqueDigits=[];
	
	//populate the uniqueLetters array
	for(let i=0;i<word1.length;i++){
		let letter=word1.charAt(i);
		if(!uniqueLetters.includes(letter)){
			uniqueLetters.push(letter);
		}
	}
	for(let i=0;i<word2.length;i++){
		let letter=word2.charAt(i);
		if(!uniqueLetters.includes(letter)){
			uniqueLetters.push(letter);
		}
	}
	for(let i=0;i<word3.length;i++){
		let letter=word3.charAt(i);
		if(!uniqueLetters.includes(letter)){
			uniqueLetters.push(letter);
		}
	}
	
	//populate the uniqueDigits array. one-to-one correspondence with uniqueLetters
	for(let i=0;i<uniqueLetters.length;i++){
		let randomDigit;
		do{
			let letter=uniqueLetters[i];
			if(letter===word1.charAt(0) || letter===word2.charAt(0) || letter===word3.charAt(0)){ //if this letter is an initial letter in any of the given three words
				randomDigit=getRandomIntInclusive(1,9); //between 1 and 9 inclusive
			}
			else{
				randomDigit=getRandomIntInclusive(0,9); //between 0 and 9 inclusive
			}
		} while(uniqueDigits.includes(randomDigit));
		uniqueDigits.push(randomDigit);
	}
	
	//construct number1, number2 and number3
	let number1str="";
	for(let i=0;i<word1.length;i++){
		let letter=word1.charAt(i);
		let digit=uniqueDigits[uniqueLetters.indexOf(letter)];
		number1str+=digit;
	}
	let number1=Number(number1str);
	
	let number2str="";
	for(let i=0;i<word2.length;i++){
		let letter=word2.charAt(i);
		let digit=uniqueDigits[uniqueLetters.indexOf(letter)];
		number2str+=digit;
	}
	let number2=Number(number2str);
	
	let number3str="";
	for(let i=0;i<word3.length;i++){
		let letter=word3.charAt(i);
		let digit=uniqueDigits[uniqueLetters.indexOf(letter)];
		number3str+=digit;
	}
	let number3=Number(number3str);
	
	//check if number1 + number2 = number3
	if(number1+number2==number3){
		return {
			result:true,
			number1:number1str,
			number2:number2str,
			number3:number3str,
			letterlist:uniqueLetters,
			digitlist:uniqueDigits
		};
	}else{
		return {
			result:false
		};
	}
}

function getRandomIntInclusive(min, max) {
	//ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
	  min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive 
}

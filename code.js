//Cryptarithmetic problem solver
//Uses a bruteforce approach. Nothing fancy
//Makes use of WebWorkers to offload the bulk of the number crunching to a separate non-UI thread
//Author : globalpolicy
//Date : September 29, 2020 | 08:16 AM

"use strict";

function calc(){
	let timeout=10000; //timeout of 10 seconds for the search
	
	let word1=document.getElementById("word1").value;
	let word2=document.getElementById("word2").value;
	let word3=document.getElementById("word3").value;
	
	clearResultText(); //clear past result if any
	
	var worker=new Worker("worker.js");
	worker.postMessage([word1,word2,word3,timeout]);
	
	worker.onmessage=function(e){
		
		switch(e.data[0].type){
			case "success":
				let output=e.data[0].result;
				updateSuccessfulResult(output);
				worker.terminate();
			break;
			case "failure":
				updateFailureResult();
				worker.terminate();
			break;
			case "progress":
				updateProgress(e.data[0].iteration,e.data[0].timeElapsed);
			break;
		}
		
	}
	
}

function clearResultText(){
	document.getElementById("result").innerHTML="";
}

function updateFailureResult(){
	document.getElementById("result").innerHTML="Couldn't find the combination. :(";
}

function updateSuccessfulResult(output){
	let divElement=document.getElementById("result");
	let outputText=`Combination found! :) <br/>
	${output.number1} + ${output.number2} = ${output.number3} <br/>
	${output.letterlist} <br/>
	${output.digitlist}`;
	divElement.innerHTML=outputText;
}

function updateProgress(iterations,elapsedTimeMs){
	document.getElementById("iterations").innerHTML=`${iterations} iterations done <br/>
	${(elapsedTimeMs/1000).toFixed(3)}s elapsed`;
}
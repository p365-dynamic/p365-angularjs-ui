/*
 *Script is created for robo logic functions applicable for Buy functionalities.
 */
//Method to get the list of riders based 

var getRoboRiders = function(RestAPI, documentType, businessLineId, roboQuestions, recommendedAddon, addOn, callback)
{
	var questions=[];
	for(var i=0;i<roboQuestions.length;i++)
	{
		//alert("length :"+roboQuestions[i].risks.length);
		for(var j=0;j<roboQuestions[i].risks.length;j++)
		{
			var question={};
			question.questionNum=roboQuestions[i].questionNum;
			question.riskNumber=roboQuestions[i].risks[j].riskNumber;	
			if(roboQuestions[i].answer==true)
				question.answer=1;
			else
				question.answer=0;
			//alert("question :"+JSON.stringify(question));
			questions.push(question);
		}
	}
	var data={};
	data.businessLineId=businessLineId;
	data.questions=questions;
	data.documentType=documentType;
	//alert("request :"+JSON.stringify(data));
	RestAPI.invoke("riskRiders",data ).then(function(callback){
		//alert("callback :"+JSON.stringify(callback));
		var response=callback.data[0]["com.sutrr.robo.motorrobo.RoboResponse"]["riderList"]["java.util.ArrayList"];
		recommendedAddon.push(response[0]["com.sutrr.robo.motorrobo.Rider"]);
		for(var i=1;i<response.length;i++)
			{
			addOn.push(response[i]["com.sutrr.robo.motorrobo.Rider"]);			
			}
			
	});
	callback();

};

/*
 * Description	: This file contains the functions to perform analytics related operations.
 * Author		: Yogesh S Shisode
 * Date			: 17 May 2016
 * */

function analyticsTrackerSendData(quoteInputParameters){
	ga('policies365Tracker.send', 'pageview', quoteInputParameters);
}
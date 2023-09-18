var lifePolicyLabels={
    "common":{
        "congratulations":"Congratulations!",
        "lifePolicyReady":"You have got your Life Insurance Policy ready now",
        "policyNo":"Policy No.",
        "sumInsured":"Sum Insured",
        "insuredName":"Name of the Insured",
        "age":"Age",
        "premiumDueDate":"Next Premium due date",
        "email":"Email",
        "address":"Address",
        "productName":"Name of the Product",
        "premiumAmount":"Premium Amount",
        "transactionNumber":"Transaction Number",
        "policyStartDate":"Policy Start Date",
        "mobileNo":"Mobile No.",
        "purchaseStatement":"Purchase Statement",
        "viewPolicy":"View Policy",
        "surveySuccess": true,
        "surveyFailure":true,
        "sorryForInconvenience":"Sorry for the inconvenience",
        "paymentFail":"We are unable to process payment for proposal number",
        "sorry":"Sorry!",
        "paymentTransactionFail":"Your Payment Transaction could not be completed",
        "proverbBuyProduct": "Buy Life Insurance to protect the ones you love"

    },
    "transactionName":{
        "validateOTP": "validateOTP",
        "sendSMS": "sendSMS"
    },
    "functionType":{
        "optAuth": "OPTAUTH",
        "otpGenerate": "GENERATE"
    },
    "policies365Title":{
        "PaySuccess": "Success-Life Policy"
       
    },
    "errorMessage":{
        "createOTP": "OTP generation failed due to some technical error. Kindly try after some time."
    },
    "validationMessages":{
        "invalidOTP": "Please enter valid OTP.",
        "expiredOTP": "Your OTP is expired. Kindly re-generate the OTP and try again.",
        "authOTP": "OTP authentication failed due to some technical problem. Kindly try after some time."
    },
    "responseCode":{
        "success": 1000,
        "noRecordsFound": 1009,
        "expiredOTP": 1012,
        "blockedMobile": 1013
    },
    "template":{
    "contactDesc":"In case of any queries or assistance, please call us on our<br><span class='wp_payFlDetailsP'>Helpline {{globalLabel.policies365Details.salesAssistNumberLanding}}</span> (Office hours 9:30 am to 6:00 pm)<br> or write to us at <span class='wp_payFlLink'><a>{{globalLabel.policies365Details.infoEmailId}}",
    "paymentFailureDesc":"We tried to charge Rs. {{lifeProposeFormDetails.premiumDetails.grossPremium}} from your account towards your Life Insurance Premium however {{lifeReponseToken.paymentGateway}} has rejected the payment. If the amount has been debited from you account already, Please contact {{lifeReponseToken.paymentGateway}} directly to get the payment refunded.<br> Please try after sometime."

    }
}

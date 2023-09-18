var bikePolicyLabels={
    "common":{
        "paymenySuccessful":"Payment Successful",
        "policyDetails":"The policy details are as follows:",
        "policyCertificateNumber":"Policy certificate number",
        "policyStartDate":"Policy Start Date",
        "policyEndDate":"Policy End Date",
        "premiumPaid":"Premium Paid Amount",
        "proverbLookForward":"We look forward to a continuous association with you.",
        "congratulations":"Congratulations!",
        "policyNo":" Policy No.",
        "idv":"IDV",
        "ncb":"NCB",
        "vehicle":"Vehicle",
        "email":"Email",
        "address":"Address",
        "transactionId":"Transaction ID",
        "premium":"Premium",
        "validity":"Validity",
        "mobileNo":"Mobile No.",
        "downloadAfter30Min":"(Please try downloading your policy after 30 minutes)",
        "viewPolicy":"View Policy",
        "signInAfter30Min":"(Please try Signing in to view your policy after 30 minutes)",
        "OTPTemplateHeader": "Login into your Policies365 account",
        "enterOTPCaption": "Enter 6 digit OTP that you got in",
        "submit":"Submit",
        "resendOtp":"Resend OTP",
        "sorryforInconvenience":"Sorry for the inconvenience",
        "transactionFail":"Your Payment Transaction could not be completed",
        "sorry":"Sorry!",
        "proverbPaySuccess": " Congratulation, you are just a step away from getting your policy.",
        "proverbPayFailure": " Ooops !!!, something went wrong. Please try again."
    },
    "transactionName":{
        "validateOTP": "validateOTP",
        "sendSMS": "sendSMS"
    },
    "validationMessages":{
        "invalidOTP": "Please enter valid OTP.",
        "expiredOTP": "Your OTP is expired. Kindly re-generate the OTP and try again.",
        "authOTP": "OTP authentication failed due to some technical problem. Kindly try after some time."
    },
    "functionType":{
        "optAuth": "OPTAUTH",
        "otpGenerate": "GENERATE"
    },
    "responseCode":{
        "success": 1000,
        "noRecordsFound": 1009,
        "expiredOTP": 1012,
        "blockedMobile": 1013
    },
    "policies365Title":{
        "PaySuccess": "Success-Bike Policy",
        "PayFailure": "Failure-Bike Policy",
    },
    "errorMessage":{
        "customerGreet":"Dear Customer",
        "payFailureErrorMsgPartOne":"Due to some technical difficulties your payment has failed and hence we are unable to process your request with proposal number",
        "payFailureErrorMsgPartTwo":"If amount has been deducted from your account kindly get in touch with your bank for refund. Sorry for the inconvenience caused.",
        "paySuccessErrorMsgPartOne":"Your payment is successful however due to some technical difficulties your policy could not be generated for your proposal request with proposal number",
        "paySuccessErrorMsgPartTwo":"Our technical team is dedicatedly working on this and get back to you shortly. Kindly be patient, your policy will be generated shortly and shared to you.",
        "helpLineMessage":"In case of any queries or assistance, please call us on our",
        "helpLineText": " Helpline ",
        "writeToUs":" (Office hours 9:30 am to 6:00 pm) or write to us @ ",
        "createOTP": "OTP generation failed due to some technical error. Kindly try after some time."
    },
    "template":{
        "thankyouDesc":"We thank you for choosing Policies365 for your insurance needs.<br> You would receive a confirmation for the premium paid along with the <br> policy copy attached, in a short while.",
        "contactDesc":"In case of any queries or assistance, please call us on our<br><span class='wp_paySuDetails'>Helpline {{globalLabel.policies365Details.salesAssistNumberLanding}}</span> (Office hours 9:30 am to 6:00 pm)<br> or write to us at <span class='wp_paySucLink'><a>{{globalLabel.policies365Details.infoEmailId}}</a></span>.",
        "redirectionDesc":"you will be redirected in {{$root.displayTime+' '}} seconds",
        "bikeNumber":"Your Bike No. {{bikeProposeFormDetails.vehicleDetails.registrationNumber}} is insured",
        "insuredBikeNumber":"Your Bike No. {{policyInfo.registrationNo}} is insured",
        "paymentFailureDesc":"We tried to charge Rs. {{bikeProposeFormDetails.premiumDetails.grossPremium}} from your account towards your Bike Insurance Premium however {{bikeReponseToken.paymentGateway}} has rejected the payment. If the amount has been debited from you account already, Please contact {{bikeReponseToken.paymentGateway}} directly to get the payment refunded. <br> Please try after sometime."
        
    }
}
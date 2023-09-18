var bikePreoposalLabels={
    "documentType":{
        "cityDetails": "CityDetails",
        "carCarrier": "CarCarrier",
        "buyScreen": "BuyScreen"
    },
    "getRequest":{
        "quoteBike": "bikeQuote",
        "calculateBikeProductQuote":"calculateBikeProductQuote"
    },
    "request":{
        "bikePropRequestType": "BikeProposalRequest",
        "findAppConfig": "findAppConfig"
    },
    "businessLineType":{
        "bike": 2,
        "car": 3
    },
    "errorMessage":{
        "serverError": "Error at server",
        "emailSentFailed": "Failed to sent email right now, please try after some time.",
        "screenConfirmErrorMsg": " does not provide Insurance for the selected pincode of the owner. Please change the input or select any other insurer from the quote screen",
        "createOTP": "OTP generation failed due to some technical error. Kindly try after some time.",
        "GSTINNumberScreenConfirmErrorMsg":"does not provide Insurance for the selected GSTIN. Please change the input or select any other insurer from the quote screen",
        "regNumberScreenConfirmErrorMsg":"does not provide Insurance for the selected registration number. Please change the input or select any other insurer from the quote screen",
        "generalisedErrMsg":"Unable to reach out to insurer as of now. Please try after some time."
    },
     "insuranceType":{
        "bike": "Two Wheeler"
    },
    "functionType":{
        "optAuth": "OPTAUTH",
        "otpGenerate": "GENERATE",
        "proposalDetailsTemplate": "ProposalDetailsTemplate"
    },
    "responseCode":{
        "success":1000 ,
        "success1":"P365RES100",
        "serverError1":"P365RES102",
        "error": 1010,
        "error1": "P365RES104",
        "systemError": 1002,
        "blockedMobile": 1013,
        "userNotExist": 1007,
        "mobileInvalidCode": 1051,
        "prevPolicyExpired":1021
    },
    "transactionName":{
        "bikeQuoteResult": "getBikeQuoteResult",
        "sendSMS": "sendSMS",
        "sendEmail": "sendEmail",
        "paymentService": "paymentService",
        "productDataReader": "productDataReader"
    },
    "professionalJourney":{
        "vehicleNotFound":"Please enter your bike model and registration year.",
        "proposalDetails":"<span data-ng-bind-html='commonInfo.salutation' data-bind-html-compile='commonInfo.salutation'></span><span ng-if='commonInfo.salutation'>. </span><span data-ng-bind-html='commonInfo.firstName' data-bind-html-compile='commonInfo.firstName'></span><span ng-if='commonInfo.firstName'>,</span> You made great choice, now I will help you to checkout please fill details."
    },
    "common":{
       "ownerAndContactDetails": "Owner & Contact Details",
       "ownerAndContactInfo":" Owner Info & Contact Details ",
       "firstName":"First Name",
       "lastName":"Last Name",
       "dateOfBirth": "Date of birth",
       "gender":"Gender",
       "emailId":"Email ID",
       "mobileNumber":"Mobile Number",
       "maritalStatus":"Marital Status",
       "GSTIN":"GSTIN Number(optional)",
       "next":"Next",
       "page":"Page",
       "pageNext":"Page >>",
       "previous":"Previous",
       "organisationName":"Organisation Name",
     "contactPerson":"Contact Person",
       "communicationAddress":"Communication Address",
       "doorNo":"Door No/Block No/Block Name",
       "address":"Address",
       "pinCode":"PIN	Code",
       "city":"City",
       "state":"State",
       "registeredAddress":"Registered Address",
       "sameAsCommAddress":"Same as communication address.",
       "isAddressSame":"Is your Registration Address same as Communication Address.",
       "registrationDoorNo":"Registration Door No.",
       "registrationAddress":"Registration Address",
       "nominationDetails":"Nomination Details",
       "appointeeDetails":"Appointee Details",
       "appointeeDesc":"Appoint a guardian to receive the claim benefits on behalf of the minor nominee",
       "relation":"Relation with Proposer",
       "previousPolicyDetails":"Previous Policy Details",
       "previousPolicyNumber":"Previous Policy Number",
       "previousPolicyInsurerName":"Previous Policy Insurer Name",
       "previousPolicyStartDate":"Previous Policy Start Date",
       "previousPolicyExpiryDate":"Previous Policy Expiry Date",
       "previousPolicyNcb":"Previous Policy NCB(%)",
       "previousPolicyType":"Previous Policy Type",
       "vehicleDetails":"Vehicle Details",
       "referralCode":"Referral Code",
       "makePayment":"Make Payment",
       "submitProposal":"Submit Proposal",
       "proposalStatus":"Proposal Status",
       "makeAndModel":"Make and Model",
       "registrationDate":"Registration	Date",
       "manufacturingYear":"Select Manufacturing Year",
       "isBikePurchasedOrLoan":"Is your bike purchased on loan?",
       "loanTakenAs":"Loan taken as ?",
       "instituteName":"Enter Name of financial institution",
       "stage":"Stage",
       "status":"Status",
       "date":"Date",
       "policy":"Policy",
       "payment":"Payment",
       "proposal":"Proposal",
       "cancel":"Cancel",
       "submit":"Submit",
       "resendOtp":"Resend OTP",
       "ok":"Ok",
       "policyExpired":"Policy is Expired.please recalculateQuote..!",
       "proposalSubmissionConfirm":"Proposal Submission Confirmation",
       "paymentLinkSend":"Payment link has been sent to customer's ",
       "userEmailId":"Email-id :",
       "link":"Link :",
       "p365prompt": "Policies365",
       "proverbBuyProduct": "Your policy insurance is few minutes away. ",
       "locationChangeMsg": "There is a change in location and premium would be re-calculated. Do you want to proceed?",
       "regNumberChangeMsg": "There is a change in registration number and premium would be re-calculated. Do you want to proceed?",
       "GSTINNumberChangeMsg":"There is a change in GSTIN number and premium would be re-calculated. Do you want to proceed?",
       "proverbPUC":"I have a valid PUC for my vehicle.",
       "proverbConfirm":"I Confirm that the information provided above is true. I am also aware of the impact on claims and other benefits of the new insurance policy due to false information. I authorize Policies365 to share these details with insurance companies and represent me with insurer for any insurance needs."
    },
    "policies365Title":{
        "bikeBuyQuote": "Buy Bike Policy"
    },
    "login":{
        "OTPTemplateHeader": "Login into your Policies365 account",
        "enterOTPCaption": "Enter 6 digit OTP that you got in"
    },
    "validationMessages":{
        "previousPolicyTypeMsg": "Liability policy cannot be renewed online. Please contact insurer.",
        "buyScreenCnfrmError": "We are unable to connect to the INSURER_NAME system right now. Please try after some time.",
        "iposFormErrorMsg": "Unable to reach Quote Response Data ",
        "generalisedErrMsg": "Unable to reach out to insurer as of now. Please try after some time."
    }
  }
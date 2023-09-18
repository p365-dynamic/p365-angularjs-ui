/*
 * Description	: This file contains the functions to perform analytics related operations.
 * Author		: 1) Yogesh S Shisode
 * Date			: 06 June 2016
 * 
 * Modification :
 * 
 * Sr.Id	   Date				Description																			Search ID			Modified By
 *  1		14-08-2017		Static List created for Product Features on Compare View - Life Insurance				modification-0001	Parul Jain
 *  2		03-04-2018 		Static List created of Contries -  Travel Insurance  									modification-0002	Akash Kumawat
 *  3 		23-05-2018		Static List created for medical questions for religare - Travel Insurance				modification-0003	Akash Kumawat
 *  4		23-05-2018		Trip type list added for travel  -  													modification-0004 	Akash Kumawat
 *  5		31-05-2018		static FamilyList for travel businessLine - Travel Insurance							modification-0005	Akash Kumawat
 * */


//Constants for common fields are declared here 
SELF = "Self";
SPOUSE = "Spouse";
SON = "Son";
DAUGHTER = "Daughter";
DATE_FORMAT = "dd/mm/yy";
FATHER = "Father";
MOTHER = "Mother";
FEMALE = "Female";
MALE = "Male";
SINGLE = "SINGLE";
MARRIED = "MARRIED";
EMPTY = "";
SPACE = " ";

defaultQuoteIds=[{"lob":0,"quoteId":"PROFQUOTE004532"},{"lob":1,"quoteId":"DefaultLifeQuote"},{"lob":2,"quoteId":"DefaultBikeQuote"},{"lob":3,"quoteId":"DefaultCarQuote"},
				 {"lob":4,"quoteId":"DefaultHealthQuote"},{"lob":5,"quoteId":"DefaultTravelQuote"}];

productPageUrls = ['/lifeproduct', '/bikeproduct', '/carproduct', '/healthproduct', '/travelproduct'];

pillarPageUrls = ['/lifequote', '/bikequote', '/carquote', '/healthquote', '/travelquote'];

commonPageUrls = ['/paysuccess', '/payfailure'];

lifePageUrls = ['/lifeResult', '/buyAssurance', '/paysuccesslife', '/payfailurelife','/lifeLanding'];
bikePageUrls = ['/bikeResult', '/buyTwoWheeler', '/paysuccessbike', '/payfailurebike'];
carPageUrls = ['/carResult', '/buyFourWheeler', '/paysuccesscar', '/payfailurecar'];
healthPageUrls = ['/healthResult', '/buyHealth', '/paysuccesshealth', '/payfailurehealth','/healthLanding'];
travelPageUrls = ['/travelResult', '/buyTravel', '/paysuccesstravel', '/payfailuretravel'];
criticalIllnessPageUrls =['/criticalIllnessResult'];
paymentPageUrls = ['/payfailurelife', '/payfailurebike', '/payfailurecar', '/payfailurehealth', '/payfailuretravel', '/paysuccesslife', '/paysuccessbike', '/paysuccesscar', '/paysuccesshealth', '/paysuccesstravel']

professionalPageUrls = ['/professionalJourneyResult', '/professionalJourney'];
proposalPageUrls = ['/proposalresdatahealth','/proposalresdatacar','/proposalresdatatravel','/proposalresdatabike','/proposalresdatalife'];

carInsuranceTypeGeneric = [{ type: "Insure New Car", value: "new", flagToShow: true }, { type: "Renew Existing Policy", value: "renew" }];
bikeInsuranceTypeGeneric = [{ type: "Insure New Bike", value: "new", flagToShow: true }, { type: "Renew Existing Policy", value: "renew" }];

comparePoliciesTypeListGen = [{ "id": 1, "label": "Own Damage Policy Term" }, { "id": 2, "label": "Third Party Policy Term" }];

carInsurancePlanTypesGen = [{ "id": 1, "value": 1, "label": "1 Year Own Damage & 3 Year Third Party Damage" },
    { "id": 2, "value": 3, "label": "3 Year Own Damage & 3 Year Third Party Damage" }
];

bikeInsurancePlanTypesGen = [{ "id": 1, "value": 1, "label": "1 Year Own Damage & 5 Year Third Party Damage" },
    { "id": 2, "value": 5, "label": "5 Year Own Damage & 5 Year Third Party Damage" }
];


carOwnDamageYears = [{ "year": 1, "value": "1 year" }, { "year": 3, "value": "3 year" }];
carPersonalAccidentYears = [{ "year": 1, "value": "1 year", "status": false }, { "year": 3, "value": "3 year", "status": false }];
carThirdPartyDamageCoveredYears = [{ "year": 3, "value": "3 year" }];

bikeOwnDamageYears = [{ "year": 1, "value": "1 year" }, { "year": 5, "value": "5 year" }];
bikePersonalAccidentYears = [{ "year": 1, "value": "1 year", "status": false }, { "year": 5, "value": "5 year", "status": false }];
bikeThirdPartyDamageCoveredYears = [{ "year": 5, "value": "5 year" }];

PACoverQuestionsGeneric = [{ "id": 1, "question": "I don't have valid driving license.", "status": true, "key": "drivingLicense" },
    { "id": 2, "question": "I already have personal accident cover in my existing motor insurance.", "status": false, "key": "existingInsurance" },
    { "id": 3, "question": "I have separate personal accident policy with sum insured of more than 15 Lakhs.", "status": false, "key": "PAPolicy" }
];

KotakDeclarationForPACover = { "accpted": true, "msg": "I declare that vehicle is either company owned or owned by an individual with existing Personal Accident (PA) cover of Rs. 15 lakhs." };

insuranceTypeListGen = [{ "id": 1, "value": "comprehensive", "display": "Comprehensive Insurance" }, { "id": 2, "value": "liability", "display": "3rd Party Liability Insurance" }];

healthTypeConditionGeneric = [{ "label": "Yes", "value": "Y" }, { "label": "No", "value": "N" }];

menuItemsGeneric = [{ "businessLineId": 3, "className": "car", "menuName": "car", "disabled": false },
    { "businessLineId": 2, "className": "bike", "menuName": "Two Wheeler", "disabled": false },
    { "businessLineId": 1, "className": "life", "menuName": "Life", "disabled": false },
    { "businessLineId": 4, "className": "health", "menuName": "Health", "disabled": false }
];


////Static List created for medical questions for religare - Travel Insurance -		modification-0003
QuestionListGen = [{
        "isStartDateApplicable": "true",
        "questionId": 1,
        "question": "Does any person(s) to be insured has any Pre-existing diseases?",
        "documentType": "TravelDiseaseQuestion",
        "applicable": false,
        "description": "Has any Proposed to be Insured been diagnosed with or suffered from / is suffering from or is currently under medication for the following. If Your response is yes to any of the following questions, please specify details of the same in the additional information section",
        "inputType": "",
        "planId": 1,
        "carrierId": 46,
        "questionCode": "PREXDISEA"
    },
    {
        "isStartDateApplicable": "true",
        "questionId": 2,
        "question": "Has anyone been diagnosed / hospitalized / or under any  treatment for any illness / injury during the last 48 months?",
        "documentType": "TravelDiseaseQuestion",
        "applicable": false,
        "description": "",
        "inputType": "",
        "planId": 1,
        "carrierId": 46,
        "questionCode": "DIAGNOSED48MONTHS"
    },
    {
        "isStartDateApplicable": "false",
        "questionId": 3,
        "question": "Have you ever claimed under any travel policy?",
        "documentType": "TravelDiseaseQuestion",
        "applicable": false,
        "description": "",
        "inputType": "",
        "planId": 1,
        "carrierId": 46,
        "questionCode": "LASTCLAIM"
    }
];

healthConditionGeneric = ["Excellent", "Good", "Fair"];
relationLifeQuoteGeneric = ['Self', 'Son', 'Daughter', 'Spouse'];
tripTypeListGeneric = [{ "tripType": "single", "displayField": "Single" }, { "tripType": "multi", "displayField": "Multi" }];
genderTypeGeneric = [{ "label": "Male", "value": "M" }, { "label": "Female", "value": "F" }];
travelGenderTypeGeneric = [{ "label": "Male", "value": "Male" }, { "label": "Female", "value": "Female" }];
preDiseaseStatusGen = [{ "label": "Yes", "value": "Y" }, { "label": "No", "value": "N" }];
tobaccoAddictionStatusGeneric = [{ "label": "Yes", "value": "Y" }, { "label": "No", "value": "N" }];
preDiseaseStatusGeneric = [{ "label": "Yes", "value": "Yes" }, { "label": "No", "value": "No" }];
tripDurationListGeneric = [{ "displayField": "30 Days", "duration": 30 }, { "displayField": "45 Days", "duration": 45 },
    { "displayField": "60 Days", "duration": 60 }, { "displayField": "90 Days", "duration": 90 }
];

currencySymbolList = [{ "symbol": "dollar", "htmlCode": "<span ng-if='true'>&#36;</span>" },
    { "symbol": "rupee", "htmlCode": "<span ng-if='true'>&#8377;</span>" },
    { "symbol": "euro", "htmlCode": "<span ng-if='true'>&#8364;</span>" },
    { "symbol": "pound", "htmlCode": "<span ng-if='true'>&#163;</span>" },
    { "symbol": "cent", "htmlCode": "<span ng-if='true'>&#162;</span>" },
    { "symbol": "yen", "htmlCode": "<span ng-if='true'>&#165;</span>" },
    { "symbol": "yuan", "htmlCode": "<span ng-if='true'>&#20803;</span>" },
    { "symbol": "french", "htmlCode": "<span ng-if='true'>&#8355;</span>" }
];

questionStatusGeneric = [{ "label": "Yes", "value": "Y" }, { "label": "No", "value": "N" }];
autoAssociationStatusGeneric = [{ "label": "Yes", "value": "Yes" }, { "label": "No", "value": "No" }];
antiTheftDeviceStatusGeneric = [{ "label": "Yes", "value": "Yes" }, { "label": "No", "value": "No" }];
purchasedLoanStatusGeneric = [{ "label": "Yes", "value": "Yes" }, { "label": "No", "value": "No" }];
yesNoStatusGeneric = [{ "label": "Yes", "value": "Yes" }, { "label": "No", "value": "No" }];

annualIncomesGeneric = [{ "display": "< 5 Lakh", 'label': "Up to 5 Lacs", "annualIncomeInterval": 1, "annualIncome": 500000, 'absoluteValue': 500000, 'minimum': 0, "maximum": 500000 },
    { "display": "5 Lakh - 10 Lakh", 'label': "5 to 10 Lacs", "annualIncomeInterval": 2, "annualIncome": 1000000, 'absoluteValue': 1000000, 'minimum': 500001, "maximum": 1000000 },
    { "display": "10 Lakh - 18 Lakh", 'label': "10 to 18 Lacs", "annualIncomeInterval": 3, "annualIncome": 1800000, 'absoluteValue': 1800000, 'minimum': 1000001, "maximum": 1800000 },
    { "display": "18 Lakh - 30 Lakh", 'label': "18 to 30 Lacs", "annualIncomeInterval": 4, "annualIncome": 3000000, 'absoluteValue': 3000000, 'minimum': 1800001, "maximum": 3000000 },
    { "display": "30 Lakh - 50 Lakh", 'label': "30 to 50 Lacs", "annualIncomeInterval": 5, "annualIncome": 5000000, 'absoluteValue': 5000000, 'minimum': 3000001, "maximum": 5000000 },
    { "display": "50 Lakh - 100 Lakh", 'label': "50 Lacs+", "annualIncomeInterval": 6, "annualIncome": 10000000, 'absoluteValue': 99000000, 'minimum': 5000001, "maximum": 99000000 }
];

spouseAnnualIncomesGeneric = [{ "display": "< 1 Lakh", "annualIncomeInterval": 1, "annualIncome": 100000 },
    { "display": "1 Lakh - 3 Lakh", "annualIncomeInterval": 2, "annualIncome": 300000 },
    { "display": "3 Lakh - 5 Lakh", "annualIncomeInterval": 3, "annualIncome": 500000 },
    { "display": "5 Lakh - 10 Lakh", "annualIncomeInterval": 4, "annualIncome": 1000000 },
    { "display": "> 10 Lakh", "annualIncomeInterval": 5, "annualIncome": 2000000 }
];

arraySumAssuredGeneric = [{ "display": "10 Lakhs", "amount": 1000000 }, { "display": "20 Lakhs", "amount": 2000000 },
    { "display": "25 Lakhs", "amount": 2500000 }, { "display": "50 Lakhs", "amount": 5000000 },
    { "display": "60 Lakhs", "amount": 6000000 }, { "display": "75 Lakhs", "amount": 7500000 },
    { "display": "1 Crore", "amount": 10000000 }, { "display": "2 Crore", "amount": 20000000 },
    { "display": "3 Crore", "amount": 30000000 }, { "display": "4 Crore", "amount": 40000000 },
    { "display": "5 Crore", "amount": 50000000 }, { "display": "6 Crore", "amount": 60000000 },
    { "display": "7 Crore", "amount": 70000000 }, { "display": "8 Crore", "amount": 80000000 },
    { "display": "9 Crore", "amount": 90000000 }, { "display": "10 Crore", "amount": 100000000 },
    { "display": "20 Crore", "amount": 200000000 }, { "display": "30 Crore", "amount": 300000000 },
    { "display": "40 Crore", "amount": 400000000 }, { "display": "50 Crore", "amount": 500000000 },
    { "display": "60 Crore", "amount": 600000000 }, { "display": "70 Crore", "amount": 700000000 },
    { "display": "70 Crore", "amount": 800000000 }, { "display": "90 Crore", "amount": 900000000 },
    { "display": "100 Crore", "amount": 1000000000 }
];

planTypeGeneric = [{ "key": 1, "display": "Critical Illness", "value": "critical" }, { "key": 2, "display": "Top Up", "value": "topup" }, { "key": 3, "display": "Base Plan", "value": "base" }];


sortTypesCriticalIllnessGeneric = [{ "key": 1, "display": "Premium" }, { "key": 2, "display": "Sum Assured" }, { "key": 3, "display": "Claims & Servicing" }];

sortTypesLifeGeneric = [{ "key": 1, "display": "Premium" }, { "key": 2, "display": "Sum Assured" }, { "key": 3, "display": "Claims & Servicing" },
    { "key": 4, "display": "Benefit Features" }, { "key": 5, "display": "Flexible Features" },
    { "key": 6, "display": "Saving Features" }, { "key": 7, "display": "Eligibility Feature" }
];

sortTypesHealthGeneric = [{ "key": 1, "display": "Premium" }, { "key": 2, "display": "Hospital limit" },
    { "key": 3, "display": "Claims & servicing" }, { "key": 4, "display": "Hospitalization Coverage" },
    { "key": 5, "display": "Preventive & Out-patient " }, { "key": 6, "display": "Bonus Coverage" },
    { "key": 7, "display": "Exclusion & Shared Cost" }
];

sortTypesTravelGeneric = [{ "key": 1, "display": "Premium" }, { "key": 2, "display": "Sum Insured" },
    { "key": 3, "display": "Claims & servicing" }
];

sortTypesVehicleGeneric = [{ "key": 0, "display": "Best Match" }, { "key": 1, "display": "Premium" }, { "key": 2, "display": "IDV" },
    { "key": 3, "display": "Claims & Servicing" }
];

sortTypesVehicleThirdPartyGeneric = [{ "key": 0, "display": "Best Match" }, { "key": 1, "display": "Premium" },
    { "key": 3, "display": "Claims & Servicing" }
];

monthListGeneric = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

healthmonthListGeneric = [{ "month": "Jan", "mCount": "01" },
    { "month": "Feb", "mCount": "02" },
    { "month": "Mar", "mCount": "03" },
    { "month": "Apr", "mCount": "04" },
    { "month": "May", "mCount": "05" },
    { "month": "Jun", "mCount": "06" },
    { "month": "Jul", "mCount": "07" },
    { "month": "Aug", "mCount": "08" },
    { "month": "Sep", "mCount": "09" },
    { "month": "Oct", "mCount": "10" },
    { "month": "Nov", "mCount": "11" },
    { "month": "Dec", "mCount": "12" }
];
/*FamilyList for travel businessLine    -  modification-0004*/
travelGeneric = [{ 'id': 1, 'member': 'Self', 'age': 35, 'gender': 'Male', 'relationship': 'S', 'occupationClass': 2, 'val': false, 'other': false, 'mandatory': false, 'minAge': 18, 'maxAge': 100, 'iconFlag': false },
    { 'id': 2, 'member': 'Spouse', 'age': 33, 'gender': 'Female', 'relationship': 'SP', 'occupationClass': 2, 'val': false, 'other': false, 'mandatory': false, 'minAge': 18, 'maxAge': 100, 'iconFlag': false },
    { 'id': 3, 'member': 'Son', 'age': 5, 'gender': 'Male', 'relationship': 'CH', 'occupationClass': 2, 'val': false, 'other': false, 'mandatory': false, 'minAge': 1, 'maxAge': 25, 'iconFlag': true },
    { 'id': 4, 'member': 'Daughter', 'age': 5, 'gender': 'Female', 'relationship': 'CH', 'occupationClass': 2, 'val': false, 'other': false, 'mandatory': false, 'minAge': 1, 'maxAge': 25, 'iconFlag': true },
    { 'id': 5, 'member': 'Father', 'age': 60, 'gender': 'Male', 'relationship': 'A', 'occupationClass': 2, 'val': false, 'other': false, 'mandatory': false, 'minAge': 36, 'maxAge': 100, 'iconFlag': false },
    { 'id': 6, 'member': 'Mother', 'age': 58, 'gender': 'Female', 'relationship': 'A', 'occupationClass': 2, 'val': false, 'other': false, 'mandatory': false, 'minAge': 36, 'maxAge': 100, 'iconFlag': false }
];


futureGenTravelGeneric = [{ 'id': 1, 'member': 'Self', 'age': 35, 'gender': 'Male', 'relationship': 'S', 'occupationClass': 2, 'val': true, 'other': false, 'mandatory': false, 'minAge': 18, 'maxAge': 100, 'iconFlag': false },
    { 'id': 2, 'member': 'Spouse', 'age': 33, 'gender': 'Female', 'relationship': 'SP', 'occupationClass': 2, 'val': true, 'other': false, 'mandatory': false, 'minAge': 18, 'maxAge': 100, 'iconFlag': false },
    { 'id': 3, 'member': 'Son', 'age': 5, 'gender': 'Male', 'relationship': 'CH', 'occupationClass': 2, 'val': true, 'other': false, 'mandatory': false, 'minAge': 1, 'maxAge': 25, 'iconFlag': true },
    { 'id': 4, 'member': 'Daughter', 'age': 5, 'gender': 'Female', 'relationship': 'CH', 'occupationClass': 2, 'val': false, 'other': false, 'mandatory': false, 'minAge': 1, 'maxAge': 25, 'iconFlag': true },
    { 'id': 5, 'member': 'Father', 'age': 60, 'gender': 'Male', 'relationship': 'A', 'occupationClass': 2, 'val': false, 'other': false, 'mandatory': false, 'minAge': 36, 'maxAge': 100, 'iconFlag': false },
    { 'id': 6, 'member': 'Mother', 'age': 58, 'gender': 'Female', 'relationship': 'A', 'occupationClass': 2, 'val': false, 'other': false, 'mandatory': false, 'minAge': 36, 'maxAge': 100, 'iconFlag': false },
    { 'id': 7, 'member': 'Brother', 'age': 35, 'gender': 'Male', 'relationship': 'A', 'occupationClass': 2, 'val': false, 'other': false, 'mandatory': false, 'minAge': 36, 'maxAge': 100, 'iconFlag': false },
    { 'id': 8, 'member': 'Sister', 'age': 33, 'gender': 'Female', 'relationship': 'A', 'occupationClass': 2, 'val': false, 'other': false, 'mandatory': false, 'minAge': 36, 'maxAge': 100, 'iconFlag': false }
];

healthFamilyListGeneric = [{ 'id': 1, 'relation': 'SELF', 'member': 'Self', 'val': true, 'age': 35, 'gender': 'M', 'relationship': 'S', 'occupationClass': 2, 'visible': true, 'other': false, 'mandatory': false, 'minAge': 18, 'maxAge': 100, 'iconFlag': false },
{ 'id': 2, 'member': 'Spouse', 'relation': 'SPOUSE', 'val': false, 'age': 33, 'gender': 'F', 'relationship': 'SP', 'occupationClass': 2, 'visible': true, 'other': false, 'mandatory': false, 'minAge': 18, 'maxAge': 100, 'iconFlag': false },
{ 'id': 3, 'member': 'Son', 'relation': 'SON', 'val': false, 'age': 5, 'gender': 'M', 'relationship': 'CH', 'occupationClass': 2, 'visible': true, 'other': false, 'mandatory': false, 'minAge': 1, 'maxAge': 25, 'iconFlag': true ,'count': 0},
{ 'id': 4, 'member': 'Daughter', 'relation': 'DAUGHTER', 'val': false, 'age': 5, 'gender': 'F', 'relationship': 'CH', 'occupationClass': 2, 'visible': true, 'other': false, 'mandatory': false, 'minAge': 1, 'maxAge': 25, 'iconFlag': true ,'count':0},
{ 'id': 5, 'member': 'Father', 'relation': 'FATHER', 'val': false, 'age': 60, 'gender': 'M', 'relationship': 'A', 'occupationClass': 2, 'visible': false, 'other': false, 'mandatory': false, 'minAge': 36, 'maxAge': 100, 'iconFlag': false },
{ 'id': 6, 'member': 'Mother', 'relation': 'MOTHER', 'val': false, 'age': 58, 'gender': 'F', 'relationship': 'A', 'occupationClass': 2, 'visible': false, 'other': false, 'mandatory': false, 'minAge': 36, 'maxAge': 100, 'iconFlag': false },
{ 'id': 7, 'member': 'Grand Father', 'relation': 'GRAND FATHER', 'val': false, 'age': 78, 'gender': 'M', 'relationship': 'A', 'occupationClass': 2, 'visible': false, 'other': true, 'mandatory': false, 'minAge': 54, 'maxAge': 100, 'iconFlag': false },
{ 'id': 8, 'member': 'Grand Mother', 'relation': 'GRAND MOTHER', 'val': false, 'age': 72, 'gender': 'F', 'relationship': 'A', 'occupationClass': 2, 'visible': false, 'other': true, 'mandatory': false, 'minAge': 54, 'maxAge': 100, 'iconFlag': false },
{ 'id': 9, 'member': 'Father-in-Law', 'relation': 'FATHER IN LAW', 'val': false, 'age': 60, 'gender': 'M', 'relationship': 'A', 'occupationClass': 2, 'visible': false, 'other': true, 'mandatory': false, 'minAge': 36, 'maxAge': 100, 'iconFlag': false },
{ 'id': 10, 'member': 'Mother-in-Law', 'relation': 'MOTHER IN LAW', 'val': false, 'age': 58, 'gender': 'F', 'relationship': 'A', 'occupationClass': 2, 'visible': false, 'other': true, 'mandatory': false, 'minAge': 36, 'maxAge': 100, 'iconFlag': false }];

personalAccidentFamilyListGeneric = [{ 'id': 1, 'member': 'Self', 'age': 35, 'gender': 'M', 'relationship': 'S', 'occupationClass': 2, 'val': true, 'other': false, 'mandatory': false, 'minAge': 18, 'maxAge': 100, 'iconFlag': false }];

personalAccidentOccupationListGeneric = [{ "occupationId": 1, "occupationClass": 1, "occupation": "Business / Traders", "display": "Business / Traders" },
    { "occupationId": 2, "occupationClass": 1, "occupation": "Professionals - Doctor, Engineer, Lawyer", "display": "Professionals - Doctor, Engineer, Lawyer" },
    { "occupationId": 3, "occupationClass": 1, "occupation": "Clerical - Supervisory role", "display": "Clerical - Supervisory role" },
    { "occupationId": 4, "occupationClass": 1, "occupation": "Hospitality and support worker", "display": "Hospitality and support worker" },
    { "occupationId": 5, "occupationClass": 1, "occupation": "Industrial worker", "display": "Industrial worker" },
    { "occupationId": 6, "occupationClass": 1, "occupation": "Farmers and Agricultural worker", "display": "Farmers and Agricultural worker" },
    { "occupationId": 7, "occupationClass": 1, "occupation": "Housewife", "display": "Housewife" },
    { "occupationId": 8, "occupationClass": 1, "occupation": "Retired person", "display": "Retired person" },
    { "occupationId": 9, "occupationClass": 1, "occupation": "Student - School and College", "display": "Student" },
    { "occupationId": 10, "occupationClass": 1, "occupation": "Practising Charterd Accountant", "display": "Charterd Accountant" },
    { "occupationId": 11, "occupationClass": 1, "occupation": "Defence and Para Military Service", "display": "Defence and Military Service" },
    { "occupationId": 12, "occupationClass": 1, "occupation": "Teacher in Govt. recognized Institution", "display": "Teacher" },
    { "occupationId": 13, "occupationClass": 1, "occupation": "Central / State Government Employee", "display": "Central / State Government Employee" },
];
selectedFamilyMemberId = [1, 2, 3];

ageList = ["18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "100"];

planBenefitsGeneric = [{ "name": "Critical Illness", "featureId": 57, "description": "Additional lump sum or higher coverage with additional premium in case of diagnosis of Critical Illnesses such as Stroke,Cancer,etc depending on the plan.", "riders": { "riderId": 16, "riderName": "Critical Illness" } },
{ "name": "Maternity Cover", "featureId": 22, "description": "This includes medical expenses during childbirth due to Normal or Caesarian delivery or lawful medical termination of pregnancy.", "riders": { "riderId": 39, "riderName": "Reduction in Maternity Waiting" }, "category": "Maternity Benefits Waiting period" },
{ "name": "Restore Benefits", "featureId": 52, "description": "Some plan provide restore or reinstatement in the form of additional Sum Assured if the Original Sum Assured is utilized fully during a policy year.", "riders": { "riderId": 33, "riderName": "Restore Benefits","description":"Restore Benifits/Unlimited Automatic Recharge" , "type":"R" }, "category": "Benefits of No Claim" },
{ "name": "No Co-Pay", "featureId": 36, "description": "Insurance companies deduct certain specified % of amount called Co-pay before settling the final claim amount and it is generally applicable beyond certain age.", "riders": { "riderId": 38, "riderName": "No Copay" }, "category": "Copay" },
//    {"name" : "Deductible", "featureId" : 66, "description" : "Insurance companies deduct certain specified % of amount called Co-pay before settling the final claim amount and it is generally applicable beyond certain age.","riders":{"riderId":44,"riderName":"Deductible"}}
];

//    {"name" : "Top Up", "featureId" : 75, "description" : "Insurance companies deduct certain specified % of amount called Co-pay before settling the final claim amount and it is generally applicable beyond certain age.","riders":{"riderId":49,"riderName":"Top Up"}},
//    {"name" : "Hospital Cash Benefit", "featureId" : 11, "description" : "Insurance companies deduct certain specified % of amount called Co-pay before settling the final claim amount and it is generally applicable beyond certain age.","riders":{"riderId":41,"riderName":"Hospital Cash Benefit"}","category":"Daily Hospital  Allowance"}];
roomRentBenefitList = [{ "name": "Private Room", "id": 1, "featureId": 1, "description": "It is the Cap applied by the Insurance companies in the form of room charges or room category for the hospital room that you can opt for.", "riders": { "riderId": 43, "riderName": "Room Rent", "value": "Private Room" }, "category": "Room rent Limits", "subCategory": "Private Non-AC" },
{ "name": "Shared Room", "id": 2, "featureId": 2, "description": "It is the Cap applied by the Insurance companies in the form of room charges or room category for the hospital room that you can opt for.", "riders": { "riderId": 43, "riderName": "Room Rent", "value": "Shared Room" }, "category": "Room rent Limits", "subCategory": "Shared" },
{ "name": "No Limit", "id": 3, "featureId": 3, "description": "It is the Cap applied by the Insurance companies in the form of room charges or room category for the hospital room that you can opt for.", "riders": { "riderId": 43, "riderName": "Room Rent", "value": "No Limit(Any Room)" }, "category": "Room rent Limits", "subCategory": "No Limit" }
];

roomTypesArrayGeneric = [{ id: 1, display: "Private Room", name: "Room Rent", featureId: 1 },
    { id: 2, display: "Shared Room", name: "Room Rent", featureId: 1 },
    { id: 3, display: "No Limit", name: "Room Rent", featureId: 1 }
];

preExistingCoveragesGeneric = [{ value: 24, display: "Covered after 2 years", name: "Pre-Existing Coverage", featureId: 60 },
    { value: 36, display: "Covered after 3 years", name: "Pre-Existing Coverage", featureId: 60 },
    { value: 48, display: "Covered after 4 years", name: "Pre-Existing Coverage", featureId: 60 }
];

companyNamesCarGeneric = [{ "name": "ICICI", "id": 1 }, { "name": "HDFC", "id": 2 }, { "name": "Aegon Religare", "id": 20 }, { "name": "Bajaj Allianz", "id": 4 }, { "name": "TATA", "id": 5 }, { "name": "Reliance", "id": 6 }, { "name": "SBI", "id": 7 }, { "name": "LIC", "id": 8 }];

ncbListGeneric = [{ "id": 0, "value": 0, "display": "0%" }, { "id": 1, "value": 20, "display": "20%" }, { "id": 2, "value": 25, "display": "25%" }, { "id": 3, "value": 35, "display": "35%" },
    { "id": 4, "value": 45, "display": "45%" }, { "id": 5, "value": 50, "display": "50%" }
];

previousClaimStatusGeneric = [{ "label": "Yes", "value": "true" }, { "label": "No", "value": "false" }];

riskLevelsGeneric = [{ id: 0, value: "LOW" }, { id: 1, value: "MEDIUM" }, { id: 2, value: "HIGH" }];

passengerCoverSAList = [10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000, 150000, 160000, 170000, 180000, 190000, 200000];
bikePassengerCoverSAList = [10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000];
driverAccidentSAList = [10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000, 150000, 160000, 170000, 180000, 190000, 200000];
lpgCngKitSAList = [10000, 20000, 30000, 40000, 50000, 60000];

defaultDriverAccidentCover = { "riderId": 20, "riderName": "Driver Accident Cover", "riderAmount": 10000 };
defaultPassengerCover = { "riderId": 21, "riderName": "Passanger Accident Cover", "riderAmount": 10000, "seatingCapacity": 4 };
defaultElectricalAccessoriesCover = { "riderId": 25, "riderName": "Electrical Accessories cover", "riderAmount": 4000 };
defaultNoElectricalAccessoriesCover = { "riderId": 30, "riderName": "Non-Electrical Accessories cover", "riderAmount": 5000 };
defaultLpgCngKitCover = { "riderId": 35, "riderName": "LPG/CNG Kit Rider", "riderAmount": 10000 };
minLpgCngKitCoverLimit = 10000;
maxLpgCngKitCoverLimit = 60000;
minCarAccessoriesLimit = 3000;
maxCarAccessoriesLimit = 25000;
minBikeAccessoriesLimit = 1000;
maxBikeAccessoriesLimit = 10000;
carIngnoredRidersForUI = [20, 21, 25, 30, 35];

//chnaged from 50 to 75, as discussed with Uday as personal age and Insured age gap should be 40
maturityAgeConstant = 65;
ciMaturityAgeConstant = 75;
lifematurityAgeConstant = 75;


defaultMaturityAgeList = [50, 55, 60, 65, 70, 75, 80];

maritalStatusListGeneric = [{ "name": "MARRIED", "id": 1 }, { "name": "SINGLE", "id": 2 }, { "name": "DIVORCE(E)", "id": 3 },
    { "name": "WIDOW(ER)", "id": 4 }
];

diabetesMellitusTermListGeneric = [{ "display": "Less than 1 Year", "term": "Below 1 years" },
    { "display": "1 - 5 Year", "term": "1-5 years" },
    { "display": "6 - 10 Year", "term": "6-10 years" },
    { "display": "Above 10 Year", "term": "Above 10 years" }
];

nomineeRelationTypeGeneric = [{ "display": "Spouse", "relation": "Spouse", "id": 1 },
    { "display": "Mother", "relation": "Mother", "id": 2 },
    { "display": "Father", "relation": "Father", "id": 3 },
    { "display": "Daughter", "relation": "Daughter", "id": 4 },
    { "display": "Son", "relation": "Son", "id": 5 },
    { "display": "Brother", "relation": "Brother", "id": 6 },
    { "display": "Sister", "relation": "Sister", "id": 7 }
];

nomineeRelationCignaTypeGeneric = [{ "display": "Self", "relation": "Self", "id": 1 },
    { "display": "Spouse", "relation": "Spouse", "id": 2 },
    { "display": "Mother", "relation": "Mother", "id": 3 },
    { "display": "Father", "relation": "Father", "id": 4 },
    { "display": "Daughter", "relation": "Daughter", "id": 5 },
    { "display": "Son", "relation": "Son", "id": 6 },
    { "display": "Brother", "relation": "Brother", "id": 7 },
    { "display": "Sister", "relation": "Sister", "id": 8 }
];

nomineeRelationFutureTypeGeneric = [
    { "display": "Husband", "relation": "Husband", "id": 1 },
    { "display": "Wife", "relation": "Wife", "id": 2 },
    { "display": "Mother", "relation": "Mother", "id": 3 },
    { "display": "Father", "relation": "Father", "id": 4 },
    { "display": "Daughter", "relation": "Daughter", "id": 5 },
    { "display": "Son", "relation": "Son", "id": 6 },
    { "display": "Brother", "relation": "Brother", "id": 7 },
    { "display": "Sister", "relation": "Sister", "id": 8 }
];

buyScreenNotMinorNomineeRealtion = [{ "name": "Spouse" }, { "name": "Father" }, { "name": "Mother" }, { "name": "Son" }, { "name": "Daughter" },
    { "name": "Brother" }, { "name": "Sister" }, { "name": "Grand Son" }, { "name": "Grand Daughter" }, { "name": "Grand Father" },
    { "name": "Grand Mother" }, { "name": "Father-in-Law" }, { "name": "Mother-in-Law" }, { "name": "Son-in-Law" },
    { "name": "Daughter-in-Law" }, { "name": "Brother-in-Law" }, { "name": "Sister-in-Law" }, { "name": "Uncle" },
    { "name": "Aunt" }, { "name": "Nephew" }, { "name": "Niece" }, { "name": "Legal Guardian" }
];

buyScreenMinorNomineeRealtion = [{ "name": "Son" }, { "name": "Daughter" }, { "name": "Brother" }, { "name": "Sister" }, { "name": "Grand Son" },
    { "name": "Grand Daughter" }, { "name": "Nephew" }, { "name": "Niece" }, { "name": "Legal Guardian" }
];

buyScreenAppointeeRelation = [{ "name": "Spouse" }, { "name": "Brother" }, { "name": "Sister" }, { "name": "Grand Son" },
    { "name": "Grand Daughter" }, { "name": "Grand Father" }, { "name": "Grand Mother" }, { "name": "Father-in-Law" },
    { "name": "Mother-in-Law" }, { "name": "Son-in-Law" }, { "name": "Daughter-in-Law" }, { "name": "Brother-in-Law" },
    { "name": "Sister-in-Law" }, { "name": "Uncle" }, { "name": "Aunt" }, { "name": "Cousin" }, { "name": "Legal Guardian" }
];

drivingExperienceYears = [{ "display": "Up to 1 Year" }, { "display": "1 to 2 Years" }, { "display": "2 to 3 Years" },
    { "display": "3 to 4 Years" }, { "display": "4 to 5 Years" }, { "display": "5 to 6 Years" },
    { "display": "6 to 7 Years" }, { "display": "7 to 8 Years" }, { "display": "8 to 9 Years" },
    { "display": "9 to 10 Years" }, { "display": "Above 10 Years" }, { "display": "No Experience" }
];

vehicleDrivenPlaces = [{ "name": "City roads" }, { "name": "Highways" },
    { "name": "Hilly areas" }, { "name": "Village roads" }, { "name": "Others" }
];

buyScreenNcbList = [{ "value": 20 }, { "value": 25 }, { "value": 35 }, { "value": 40 }, { "value": 50 }];

buyScreenMileageList = [{ "value": "Up to 1,000 kms" }, { "value": "1,000 to 2,000 kms" }, { "value": "Above 2,000 kms" }];

vehicleLoanTypes = [{ "name": "Hypothecation", "id": 1 }, { "name": "Lease", "id": 2 }, { "name": "Hire Purchase", "id": 3 }];

automobileMembershipTypes = [{ "id": 1, "name": "AAIE" }, { "id": 2, "name": "AASI" }, { "id": 3, "name": "AAUI" },
    { "id": 4, "name": "WIAA" }, { "id": 8, "name": "UPAA" }
];

religareDiseaseQuestionList = [{ "id": 1, "question": "Cancer?", "existSince": "", "status": "No", "existSinceError": false },
    { "id": 2, "question": "Cardio Vascular or Heart related ailments?", "existSince": "", "status": "No", "existSinceError": false },
    { "id": 3, "question": "Hypertension?", "existSince": "", "status": "No", "existSinceError": false },
    { "id": 4, "question": "Asthma or Lung related ailment?", "existSince": "", "status": "No", "existSinceError": false },
    { "id": 5, "question": "Endocrine system disorder?", "existSince": "", "status": "No", "existSinceError": false },
    { "id": 6, "question": "Diabetes Mellitus?", "existSince": "", "status": "No", "existSinceError": false },
    { "id": 7, "question": "Neuro Muscular or Psychiatry disorder?", "existSince": "", "status": "No", "existSinceError": false },
    { "id": 8, "question": "Pancreatic or Liver related disease?", "existSince": "", "status": "No", "existSinceError": false },
    { "id": 9, "question": "Kidney or Urinary tract or reproductive related disorder?", "existSince": "", "status": "No", "existSinceError": false },
    { "id": 10, "question": "Immunity system disorder or Arthritis?", "existSince": "", "status": "No", "existSinceError": false },
    { "id": 11, "question": "Any of you Consume Alcohol or tobacco?", "existSince": "", "status": "No", "existSinceError": false },
    { "id": 12, "question": "Any other disease or ailment or treatment not mentioned above?", "existSince": "", "status": "No", "existSinceError": false },
    { "id": 13, "question": "Consultation or treatment other than child birth?", "existSince": "", "status": "No", "existSinceError": false },
    { "id": 14, "question": "Hospitalization other than child birth?", "existSince": "", "status": "No", "existSinceError": false }
];

iciciHealthQuestionListForLifeQuote = [{ "id": 1, "question": "Do you consume or have ever consumed Narcotics?", "answer": "No" },
    { "id": 2, "question": "Do you consume or have ever consumed Tobacco?", "answer": "No" },
    { "id": 3, "question": "Are you employed in the armed, para military or police forces?", "answer": "No" },
    { "id": 4, "question": "Do you have any congenital defect/Abnormality/Physical Deformity/Handicap?", "answer": "No" },
    { "id": 5, "question": "Are any of your family members suffering from/have suffered from/died of Heart Disease/Diabetes Mellitus/Cancer or any other hereditary disease?", "answer": "No" },
    { "id": 6, "question": "Have you undergone or been advised to undergo any tests/investigations or any other surgery or hospitalized for obervation or treatment in the past?", "answer": "No" },
    { "id": 7, "question": "Have you undergone Angioplasty/ Bypass Surgery/ Heart Surgery?", "answer": "No" },
    { "id": 8, "question": "Are you suffering from Hypertension/ High BP/ High Cholestrol?", "answer": "No" },
    { "id": 9, "question": "Are you suffering from Chest Pain/Heart Attack/Heart Disease?", "answer": "No" },
    { "id": 10, "question": "Are you suffering from Diabetes/High Blood Sugar/Sugar in Urine?", "answer": "No" },
    { "id": 11, "question": "Are you suffering from Asthma/TB/Respiratory Disorder?", "answer": "No" },
    { "id": 12, "question": "Are you suffering from Nervous Disorder/Stroke/Paralysis/Epilepsy?", "answer": "No" },
    { "id": 13, "question": "Are you suffering from Gastrointestinal Disorders/Pancreatitis/Colitis?", "answer": "No" },
    { "id": 14, "question": "Are you suffering from Liver Disorders/Jaundice/Hepatitis B or C?", "answer": "No" },
    { "id": 15, "question": "Are you suffering from Genitourinary Disorders related to Kidney/Prostate etc.?", "answer": "No" },
    { "id": 16, "question": "Are you suffering from Cancer/Tumour/Growth/Cyst?", "answer": "No" },
    { "id": 17, "question": "Are you suffering from HIV Infection/AIDS?", "answer": "No" },
    { "id": 18, "question": "Are you suffering from Blood Disorders/Anaemia/Thalassemia?", "answer": "No" },
    { "id": 19, "question": "Are you suffering from Nervous Psychiatric/Mental Disorders?", "answer": "No" },
    { "id": 20, "question": "Are you suffering from any other Disorder not mentioned?", "answer": "No" }
];

lifePayoutOptionsGeneric = [{ "id": 0, "name": "Lumpsum", "description": "Choose if you want to ensure that the claim is paid in a single payment. The claim payment generally equals the sum insured opted for. This change might impact premium calculation." },
    { "id": 1, "name": "Monthly Income", "description": "Choose if you want to ensure that the claim is paid through monthly income. This is equated monthly instalment for a specific duration or based on the duration to be opted for. This change might impact premium calculation." },
    { "id": 2, "name": "Increasing Monthly Income", "description": "Choose if you want to ensure that the claim is paid through monthly income increasing every year. The increase can be a specific increase or compound increase depending on insurer. This change might impact premium calculation." },
    { "id": 3, "name": "Lumpsum + Monthly Income", "description": "Choose if you want to ensure that the claim is paid in combination of single payment and equated monthly income. Lumpsum payment either can be equal to sum assured or a fixed amount as per product. This change might impact premium calculation." },
    { "id": 4, "name": "Lumpsum + Increasing Monthly Income", "description": "Choose if you want to ensure that the claim is paid in combination of single payment and increasing monthly income. Lumpsum payment either can be equal to sum assured or a fixed amount as per product. This change might impact premium calculation." },
    { "id": 5, "name": "Return of Premium", "description": "Choose if you want to get premium paid for coverage if you survives the policy terms " },
    { "id": 6, "name": "Life Long", "description": "Choose if you want to insured for entire life.under this plan upon insured death nominee will get lumpsum bebefit" }
];

kotakEducationList = [{ "id": 0, "label": "Professional" }, { "id": 1, "label": "Graduate & above" }, { "id": 2, "label": "HSC(12th Std.)" }];

iciciOccupationList = [{ "occupationClass": 0, "occupation": "Salaried" }, { "occupationClass": 1, "occupation": "Agriculturalist" }, { "occupationClass": 2, "occupation": "ICICI Group Employee" },
    { "occupationClass": 3, "occupation": "Others" }, { "occupationClass": 4, "occupation": "Professional" }, { "occupationClass": 5, "occupation": "Retired" },
    { "occupationClass": 6, "occupation": "Self Employed" }, { "occupationClass": 7, "occupation": "Student" }
];

iciciEducationList = [{ "id": 0, "label": "Post Graduate" }, { "id": 1, "label": "Graduate" }, { "id": 2, "label": "Diploma" },
    { "id": 3, "label": "12th" }, { "id": 4, "label": "10th" }, { "id": 5, "label": "Below 10th" }
];

iciciOrganisationTypeList = [{ "id": 0, "label": "Government" }, { "id": 1, "label": "Hindu Undivided Family" }, { "id": 2, "label": "Others" },
    { "id": 3, "label": "Partner" }, { "id": 4, "label": "Private Limited" }, { "id": 5, "label": "Proprietor" },
    { "id": 6, "label": "Public Limited" }, { "id": 7, "label": "Section 25 Company" }, { "id": 8, "label": "Society" },
    { "id": 9, "label": "Trust" }
];

iciciEInsuranceRepositoryList = [{ "id": 0, "label": "NSDL Database Management Limited" },
    { "id": 1, "label": "CAMS Repository Services Ltd" },
    { "id": 2, "label": "Central Insurance Repository Limited (CDSL Group)" },
    { "id": 3, "label": "Karvy Insurance Repository Limited" },
    { "id": 4, "label": "NOT Interested" }
];

iciciHarmfulIndustryTypeList = [{ "id": 0, "label": "Jewellery" }, { "id": 1, "label": "Shipping" }, { "id": 2, "label": "Agriculture" },
    { "id": 3, "label": "Scrap Dealing" }, { "id": 4, "label": "Stock Broking" }, { "id": 5, "label": "Import/Export" },
    { "id": 6, "label": "Import/Export" }
];

iciciTobaccoTypeList = [{ "id": 0, "label": "Bidi" }, { "id": 1, "label": "Cigar" }, { "id": 2, "label": "Cigarettes" },
    { "id": 3, "label": "Gutka" }, { "id": 4, "label": "Pan" }, { "id": 5, "label": "All of the above" }
];

iciciTobaccoQuantityList = [{ "id": 0, "label": "6-10units" }, { "id": 1, "label": "<5units" }, { "id": 2, "label": ">10units" }];

iciciAlcoholTypeList = [{ "id": 0, "label": "Beer(Bottles)" }, { "id": 1, "label": "Liquor(Pegs)" }, { "id": 2, "label": "Wine(Glasses)" },
    { "id": 3, "label": "All of the above" }
];

iciciAlcoholQuantityList = [{ "id": 0, "label": "1-2" }, { "id": 1, "label": ">2" }, { "id": 2, "label": "Nil" }];

policyTypesGeneric = [{ "id": 1, "display": "Comprehensive Policy" }, { "id": 2, "display": "Bundled Policy" }];

preExistingDiseaseNotAllowed = [5, 12, 14, 11, 17, 16];

comparePoliciesDisplayValues = [{ "id": 1, "label": "Calculated Insured Declared Value" }, { "id": 2, "label": "Premium" }, { "id": 3, "label": "No Claim Bonus %" },
    { "id": 4, "label": "Minimum IDV Allowed" }, { "id": 5, "label": "Maximum IDV Allowed" }, { "id": 6, "label": "Own Damage Premium" },
    { "id": 7, "label": "Third Party Premium" }, { "id": 8, "label": "Pemium for Personal Accident Cover" }, { "id": 9, "label": "Cashless garages near you" },
    { "id": 10, "label": "Compulsory Deductible for Claims" }, { "id": 11, "label": "Voluntary Deductible for Claims" }
];
religareHealthQuestions = [{ "questionCode": "DIAGNOSED48HRS", "applicable": false, "question": "Any of the person(s) to be insured been diagnosed /hospitalized for any illness / injury during the last 48 months?", "desc": "Provide right information so that your records are correctly updated and claims processing can be quicker.", "data": "" },
    { "questionCode": "LASTCLAIM", "applicable": false, "question": "Any of the person(s) to be insured ever filed a claim with their current / previous insurer?", "desc": "Provide right information so that your records are correctly updated and claims processing can be quicker.", "data": "" },
    { "questionCode": "DECLINEDINS", "applicable": false, "question": "Any proposal for Health insurance of person(s) to be insured been declined, cancelled or charged a higher premium?", "desc": "Provide right information so that your records are correctly updated and claims processing can be quicker", "data": "" },
    { "questionCode": "OTHERINS", "applicable": false, "question": "Any of the person(s) to be insured, already covered under any other health insurance policy of Religare Health Insurance?", "desc": "Select Yes if any of the person to be insured hold a self-bought or group insurance policy of Religare.", "data": "" }
];
//commented for all health carriers
/*{"undertakingCode":"DieaseUndertaking","undertaking":"Select if you or any member of your family proposed to be insured, suffered or are suffering from any disease/ailment/adverse medical condition of any kind especially Heart/Stroke/Cancer/Renal disorder/Alzheimer's disease/Parkinsons's disease*","desc":"","data":null,"required":""},*/
religareUndertakingList = [
    { "undertakingCode": "GeneralUndertaking", "undertaking": "I Confirm that the information provided above is true. I am also aware of the impact on claims and other benefits of the new insurance policy due to false information. I authorize Policies365 to share these details with insurance companies and represent me with insurer for any insurance needs.", "desc": "", "data": null }
]
deductiblePlanA = [{ "id": 1, "value": "25000" }, { "id": 2, "value": "50000" }, { "id": 3, "value": "100000" }];

deductiblePlanB = [{ "id": 1, "value": "25000" }, { "id": 2, "value": "50000" }, { "id": 3, "value": "100000" }, { "id": 4, "value": "200000" }];

deductiblePlanC = [{ "id": 1, "value": "300000" }, { "id": 2, "value": "400000" }, { "id": 3, "value": "500000" }];

//Added by Supriya
hospitalLimitList = [{ "id": 1, "label": "Room Rent Eligibility" }, { "id": 2, "label": "Day Care Treatments" },
    { "id": 3, "label": "Daily Hospitalisation Allowance" }, { "id": 3, "label": "Ambulance" },
    { "id": 3, "label": "Network Hospitals" }
];

preventiveAndOutPatientList = [{ "id": 1, "label": "Hospitalization at Home" }, { "id": 2, "label": "Health checkup" },
    { "id": 3, "label": "Specific Illness" }, { "id": 3, "label": "Outpatient Medical Expense" },
    { "id": 3, "label": "Ayurvedic/Homeopathy" }
];

bonusCoverageList = [{ "id": 1, "label": "Restore Benefit" }, { "id": 2, "label": "Benefits of No Claim" },
    { "id": 3, "label": "Reduction of No Claim Benefit" }, { "id": 3, "label": "Critical Illness" }
];

exclusionAndSharedCostList = [{ "id": 1, "label": "Existing disease coverage" },
    { "id": 2, "label": "Waiting period for Claim" },
    { "id": 3, "label": "Co-payment by customer to extent of" }
];


//Static List created for Product Features on Compare View - Life Insurance - modification-0001
compareLifePoliciesDisplayValues = [{ "id": 1, "label": "Death Benefit in" }, { "id": 2, "label": "Lumpsum Amount" },
    { "id": 3, "label": "Lumpsum % to Sum Assured" }, { "id": 4, "label": "Monthly Instalment amount" },
    { "id": 5, "label": "No. of Monthly instalments" }
];

defaultQuoteIds=[{"lob":0,"quoteId":"PROFQUOTE004532"},{"lob":1,"quoteId":"DefaultLifeQuote"},{"lob":2,"quoteId":"DefaultBikeQuote"},{"lob":3,"quoteId":"DefaultCarQuote"},
{"lob":4,"quoteId":"DefaultHealthQuote"},{"lob":5,"quoteId":"DefaultTravelQuote"}];

//for dynamic meta tag - landing pages & common pages
var setDescription = 'Compare online insurance policies offered by various insurers of India. Get instant insurance quotes and buy insurance plans like car, life, health and travel';
var setDescriptionBike = 'Compare online two wheeler  insurance policies offered by various insurers of India. Get instant insurance quotes and buy insurance plans like car, life, health and travel.';
var setKeyword = 'compare, insurance, life, car, health, travel, pension, investment, child, home, corporate, quotes, rates, online, plans, policy, best, India, companies, buy';
var setKeywordHealth = 'best health insurance in India,best health insurance company,buy health insurance,compare health insurance, compare, insurance, life, car, health, travel, pension, investment, child, home, corporate, quotes, rates, online, plans, policy, best, India, companies, buy';
var setKeywordCar = 'car insurance claim,car insurance coverage,online car insurance policy,compare, insurance, life, car, health, travel, pension, investment, child, home, corporate, quotes, rates, online, plans, policy, best, India, companies, buy';
var setKeywordBike = 'two wheeler insurance, bike insurance renewal, online two wheeler insurance, two wheeler insurance third party, third party bike insurance, insurance policy for bike, compare, insurance, life, car, health, travel, pension, investment, child, home, corporate, quotes, rates, online, plans, policy, best, India, companies, buy';
var setKeywordLife = 'top life insurance companies,life insurance premium,insurance companies in india,top life insurance companies, compare, insurance, life, car, health, travel, pension, investment, child, home, corporate, quotes, rates, online, plans, policy, best, India, companies, buy';


//source origin type for policies365 web-application
var sourceOrigin = "web";
var deviceIdOrigin = "ABCD12345";
//var sourceOrigin = SOURCE_ORIGIN;
//var deviceIdOrigin = CHANNEL;
//disable few links for production

//condition to give dynamic path for wordpress.
// var localized = WORD_PRESS_DYNAMIC_URL;
// var agencyPortalUrl = AGENCY_PORTAL_DYNAMIC_URL;
// var agencyURL=AGENCY_URL;
var agencyPortalUrl = 'http://192.168.0.10/policies365/#/proposalresdata?proposalId=';
var localized = '';

/* Global Variables For iQuote and Website Env*/
// var baseEnvEnabled = BASE_VARIABLE_DEFINATION;
// var customEnvEnabled = CUSTOM_VARIABLE_DEFINATION;
// var wordPressEnabled = WORD_PRESS_ENABLED_FLAG;
// var agencyPortalEnabled = AGENCY_PORTAL_ENABLED_FLAG;
// var iquoteEnabled = IQUOTE_ENABLED_FLAG;
// var professionalJourney = PROFESSIONAL_JOURNEY_FLAG;
// var iquoteJqueryEnabled = IQUOTE_JQUERY_ENABLED_FLAG;
// var icrmEnabled = ICRM_ENABLED_FLAG;
// var termAndConditions = TERM_AND_CONDITIONS_URL;
// var privacyPolicy = PRIVACY_POLICY_URL;
// var shareQuoteLink = SHARE_QUOTE_LINK;
// var sharePaymentLink = SHARE_PAYMENT_LINK;
// var shareProfessionalQuoteLink = SHARE_PROFESSIONAL_QUOTE_LINK;
// var imauticAutomation = MARKETTING_AUTOMATION;
// var pospEnabled = POSP_ENABLED_FLAG;


var baseEnvEnabled = true;
var customEnvEnabled = false;
var wordPressEnabled = true;
var agencyPortalEnabled = false;
var iquoteEnabled = false;
var icrmEnabled = false;
var iquoteJqueryEnabled = true;
var professionalJourney = true;
var imauticAutomation = false;
var pospEnabled = false;
// var otherwiseRoute = JSON.parse('{"redirectTo": "/professionalJourney"}');

 shareQuoteLink = "http://uat.policies365.com/sharequote#/sharefromAPI?docId=%22;";
 shareProfessionalQuoteLink = "http://p365dev.infintus.com/shareprofile#/professionalShareAPI?docId=";
 sharePaymentLink = "http://p365dev.infintus.com/ipos#/proposalresdata?proposalId="; 

//var idepProdEnv = FIELD_ENABLE_STATUS;
 var idepProdEnv = false;
// 
// olark redirection
var redirectURL = 'http://192.168.0.50:9091/policies365/index.html#/';
var termAndConditions = "http://p365dev.infintus.com/termsandconditions/";
var privacyPolicy = "http://p365dev.infintus.com/privacy-policy/";
APPLICATION_VERSION = "policies365-version-10064";
getSearchServiceLink = 'http://uatservices.policies365.com/cxf/configmanager/config/getaddress?filter=';
getServiceLink = 'https://mservices.policies365.com/cxf/configmanager/config/getconfigdata?filter='; //'http://uatservices.policies365.com/cxf/configmanager/config/getconfigdata?filter=';
getQuoteCalcLink = 'http://uatservices.policies365.com/cxf/authrestservices/integrate/invoke';
 getShortURLLink='http://uatservices.policies365.com/cxf/urlshortnerservice/urlshortner/getshorturl/integrate/invoke';


// redirectURL = "WEB_APP_URL";
// APPLICATION_VERSION = "WEB_APPLICATION_VERSION";
// getSearchServiceLink = 'WEBSERVICE_URL/configmanager/config/getaddress?filter=';
// getServiceLink = 'WEBSERVICE_URL/configmanager/config/getconfigdata?filter=';
// getQuoteCalcLink = 'WEBSERVICE_URL/authrestservices/integrate/invoke';
// getShortURLLink = 'WEBSERVICE_URL/urlshortnerservice/urlshortner/getshorturl/integrate/invoke';
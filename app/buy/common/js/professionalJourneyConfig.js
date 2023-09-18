
ageList = ["2001", "2000", "1999", "1998", "1997", "1996", "1995", "1994", "1993", "1992", "1991", "1990", "1989", "1988", "1987", "1986", "1985", "1984", "1983", "1982", "1981", "1980", "1979", "1978", "1977", "1976", "1975", "1974", "1973", "1972", "1971", "1970", "1969", "1968", "1967", "1966", "1965", "1964", "1963", "1962", "1961", "1960", "1959", "1958", "1957", "1956", "1955", "1954", "1953", "1952", "1951", "1950", "1949", "1948", "1947", "1946", "1945", "1944", "1943", "1942", "1941", "1940", "1939", "1938", "1937", "1936", "1935", "1934", "1933", "1932", "1931", "1930", "1929", "1928", "1927", "1926", "1925", "1924", "1923", "1922", "1921", "1920", "1919"];

incomeRangeList = [{ 'label': "Up to 5 Lacs", 'absoluteValue': 500000, 'minimum': 0, "maximum": 500000 },
{ 'label': "5 to 10 Lacs", 'absoluteValue': 1000000, 'minimum': 500001, "maximum": 1000000 },
{ 'label': "10 to 18 Lacs", 'absoluteValue': 1800000, 'minimum': 1000001, "maximum": 1800000 },
{ 'label': "18 to 30 Lacs", 'absoluteValue': 3000000, 'minimum': 1800001, "maximum": 3000000 },
{ 'label': "30 to 50 Lacs", 'absoluteValue': 5000000, 'minimum': 3000001, "maximum": 5000000 },
{ 'label': "50 Lacs+", 'absoluteValue': 99000000, 'minimum': 5000001, "maximum": 99000000 }];

annualIncomesGeneric = [{ "display": "< 5 Lakh", 'label': "Up to 5 Lacs", "annualIncomeInterval": 1, "annualIncome": 500000,'absoluteValue': 500000, 'minimum': 0, "maximum": 500000  },
{ "display": "5 Lakh - 10 Lakh",'label': "5 to 10 Lacs", "annualIncomeInterval": 2, "annualIncome": 1000000, 'absoluteValue': 1000000, 'minimum': 500001, "maximum": 1000000},
{ "display": "10 Lakh - 18 Lakh",'label': "10 to 18 Lacs", "annualIncomeInterval": 3 ,"annualIncome": 1800000 ,'absoluteValue': 1800000, 'minimum': 1000001, "maximum": 1800000},
{ "display": "18 Lakh - 30 Lakh",'label': "18 to 30 Lacs", "annualIncomeInterval": 4, "annualIncome": 3000000 ,'absoluteValue': 3000000, 'minimum': 1800001, "maximum": 3000000},
{ "display": "30 Lakh - 50 Lakh",'label': "30 to 50 Lacs", "annualIncomeInterval": 5, "annualIncome": 5000000 , 'absoluteValue': 5000000, 'minimum': 3000001, "maximum": 5000000},
{ "display": "50 Lakh - 100 Lakh",'label': "50 Lacs+", "annualIncomeInterval": 6, "annualIncome": 10000000, 'absoluteValue': 99000000, 'minimum': 5000001, "maximum": 99000000 }
];

diseaseList = [{ "label": "Diabetes", 'diseaseName': "diabetes" }, { "label": "Blood Pressure", 'diseaseName': "bloodPressure" }, { "label": "Heart Disease", 'diseaseName': "heartDisease" }];

weightStatus = [{ "index": 0, "value": "Under Weight" }, { "index": 1, "value": "Normal Weight" }, { "index": 2, "value": "Over Weight" }];

dailyActivityStatus = [{ "index": 0, "value": "Low" }, { "index": 1, "value": "Adequte" }, { "index": 2, "value": "High" }];

professionListForCRM = [{ "index": 1, "value": 'healthcare' }, { "index": 2, "value": 'technical' }, { "index": 3, "value": 'finance' },
{ "index": 4, "value": 'hospitality' }, { "index": 5, "value": 'self_employed' }, { "index": 6, "value": 'marketing' },
{ "index": 7, "value": 'others' }];

ngoList = [{ 'name': 'armedForces', 'displayName': 'Armed Forces', 'preference': 1 },
{ 'name': 'childrenEducation', 'displayName': 'Children Education', 'preference': 3 },
{ 'name': 'elderlyCare', 'displayName': 'Elderly Care', 'preference': 2 },
{ 'name': 'ruralUpliftment', 'displayName': 'Rural Upliftment', 'preference': 4 },
{ 'name': 'sanitationAndCleanliness', 'displayName': 'Sanitation & Cleanliness', 'preference': 6 },
{ 'name': 'womenEmpowerment', 'displayName': 'Women Empowerment', 'preference': 5 }];

homeOwnershipList = [{ 'label': 'RENTED', 'value': 'Rented' }, { 'label': 'OWNED', 'value': 'Owned' }];

clinicOwnershipList = [{ 'label': 'RENTED', 'value': 'Rented' }, { 'label': 'OWNED', 'value': 'Owned' }, { 'label': 'SAME AS HOME', 'value': 'Same as home' }];

familyMemberList = [{ 'relation': 'SELF', 'status': true, 'age': 35, 'minAgeApplicable': 18, 'maxAgeApplicable': 99, 'relationship': 'S', 'visible': true, 'iconFlag': false },
{ 'relation': 'SPOUSE', 'status': false, 'age': 33, 'minAgeApplicable': 18, 'maxAgeApplicable': 99, 'relationship': 'SP', 'visible': true, 'iconFlag': false },
{ 'relation': 'SON', 'status': false, 'age': 5, 'minAgeApplicable': 1, 'maxAgeApplicable': 24, 'relationship': 'CH', 'visible': true, 'iconFlag': true, 'gender': 'male' },
{ 'relation': 'DAUGHTER', 'status': false, 'age': 5, 'minAgeApplicable': 1, 'maxAgeApplicable': 24, 'relationship': 'CH', 'visible': true, 'iconFlag': true, 'gender': 'female' },
{ 'relation': 'FATHER', 'status': false, 'age': 60, 'minAgeApplicable': 18, 'maxAgeApplicable': 99, 'relationship': 'A', 'visible': false, 'iconFlag': false, 'gender': 'male' },
{ 'relation': 'MOTHER', 'status': false, 'age': 58, 'minAgeApplicable': 18, 'maxAgeApplicable': 99, 'relationship': 'A', 'visible': false, 'iconFlag': false, 'gender': 'female' },
{ 'relation': 'GRAND FATHER', 'status': false, 'age': 78, 'minAgeApplicable': 54, 'maxAgeApplicable': 100, 'relationship': 'A', 'visible': false, 'iconFlag': false, 'gender': 'male' },
{ 'relation': 'GRAND MOTHER', 'status': false, 'age': 72, 'minAgeApplicable': 54, 'maxAgeApplicable': 100, 'relationship': 'A', 'visible': false, 'iconFlag': false, 'gender': 'female' }];

healthFamilyListGeneric = [
{ 'id': 1, 'relation': 'SELF', 'member': 'Self', 'val': true, 'age': 35, 'gender': 'M', 'relationship': 'S', 'occupationClass': 2, 'visible': true, 'other': false, 'mandatory': false, 'minAge': 18, 'maxAge': 100, 'iconFlag': false },
{ 'id': 2, 'member': 'Spouse', 'relation': 'SPOUSE', 'val': false, 'age': 33, 'gender': 'F', 'relationship': 'SP', 'occupationClass': 2, 'visible': true, 'other': false, 'mandatory': false, 'minAge': 18, 'maxAge': 100, 'iconFlag': false },
{ 'id': 3, 'member': 'Son', 'relation': 'SON', 'val': false, 'age': 5, 'gender': 'M', 'relationship': 'CH', 'occupationClass': 2, 'visible': true, 'other': false, 'mandatory': false, 'minAge': 1, 'maxAge': 25, 'iconFlag': true,'count': 0 },
{ 'id': 4, 'member': 'Daughter', 'relation': 'DAUGHTER', 'val': false, 'age': 5, 'gender': 'F', 'relationship': 'CH', 'occupationClass': 2, 'visible': true, 'other': false, 'mandatory': false, 'minAge': 1, 'maxAge': 25, 'iconFlag': true ,'count':0},
{ 'id': 5, 'member': 'Father', 'relation': 'FATHER', 'val': false, 'age': 60, 'gender': 'M', 'relationship': 'A', 'occupationClass': 2, 'visible': false, 'other': false, 'mandatory': false, 'minAge': 36, 'maxAge': 100, 'iconFlag': false },
{ 'id': 6, 'member': 'Mother', 'relation': 'MOTHER', 'val': false, 'age': 58, 'gender': 'F', 'relationship': 'A', 'occupationClass': 2, 'visible': false, 'other': false, 'mandatory': false, 'minAge': 36, 'maxAge': 100, 'iconFlag': false },
{ 'id': 7, 'member': 'Grand Father', 'relation': 'GRAND FATHER', 'val': false, 'age': 78, 'gender': 'M', 'relationship': 'A', 'occupationClass': 2, 'visible': false, 'other': true, 'mandatory': false, 'minAge': 54, 'maxAge': 100, 'iconFlag': false },
{ 'id': 8, 'member': 'Grand Mother', 'relation': 'GRAND MOTHER', 'val': false, 'age': 72, 'gender': 'F', 'relationship': 'A', 'occupationClass': 2, 'visible': false, 'other': true, 'mandatory': false, 'minAge': 54, 'maxAge': 100, 'iconFlag': false },
{ 'id': 9, 'member': 'Father-in-Law', 'relation': 'FATHER IN LAW', 'val': false, 'age': 60, 'gender': 'M', 'relationship': 'A', 'occupationClass': 2, 'visible': false, 'other': true, 'mandatory': false, 'minAge': 36, 'maxAge': 100, 'iconFlag': false },
{ 'id': 10, 'member': 'Mother-in-Law', 'relation': 'MOTHER IN LAW', 'val': false, 'age': 58, 'gender': 'F', 'relationship': 'A', 'occupationClass': 2, 'visible': false, 'other': true, 'mandatory': false, 'minAge': 36, 'maxAge': 100, 'iconFlag': false }
];

drProfessionSpecializationList = [{ 'label': 'General Physician', 'value': 'General Physician' },
{ 'label': 'Cardiologist', 'value': 'Cardiologist'},
{ 'label': 'Opthalmologist', 'value': 'Opthalmologist'},
{ 'label': 'Dentist', 'value': 'Dentist'},
{ 'label': 'Gynecologist', 'value': 'Gynecologist'},
{ 'label': 'Radiologist', 'value': 'Radiologist', 'skipTo': 'ngo', 'skippedFrom': 'specialisation','skippedParams':['professionalLiability','clinicStatus']},
{ 'label': 'Pathologist', 'value': 'Pathologist', 'skipTo': 'ngo', 'skippedFrom': 'specialisation','skippedParams':['professionalLiability','clinicStatus']},
{ 'label': 'Orthopedic', 'value': 'Orthopedic'},
{ 'label': 'Hospital Staff', 'value': 'Hospital Staff', 'skipTo': 'ngo', 'skippedFrom': 'specialisation','skippedParams':['professionalLiability','clinicStatus']},
{ 'label': 'Other', 'value': 'Other', 'skipTo': 'ngo', 'skippedFrom': 'specialisation','skippedParams':['professionalLiability','clinicStatus'] }];

drProfessionalLiabilityList = [{ 'label': 'RUN A CLINIC', 'value': 'Run a clinic' }, { 'label': 'HOSPITAL', 'value': 'Hospital', 'skipTo': 'ngo', 'skippedFrom': 'personalLibility','skippedParams':['clinicStatus']}, { 'label': 'BOTH', 'value': 'Both' }];

IDVOptionsGen = [{ 'value': 1, 'label': 'BEST DEAL' }, { 'value': 2, 'label': 'YOUR IDV' }, { 'value': 3, 'label': 'MIN IDV' }];





// recommnededRiders = [{
// 	"id": "2",
// 	"lob": "Car",
// 	"coverageAmount": "100000",
// 	"riders": [{
// 		"note": "Zero Depreciation Cover selected does not include Add-ons for Consumables Cover",
// 		"riderId": 6,
// 		"description": "In case of claim due to repair to the vehicle, if you do not wish to pay anything except standard claim registration charge, please opt for Zero Depreciation. Please note this will increase your premium amount slightly",
// 		"riderName": "Zero Depreciation cover",
// 		"isEnable": "Y"
// 	},
// 	{
// 		"riderId": 7,
// 		"description": "In case you wish to retain the No Claim Bonus discount even in case of claim, opt for No Claim Bonus Protection coverage. This involves additional premium and is highly recommended if you have earned a No Claim Bonus discount already",
// 		"riderName": "NCB Protection",
// 		"isEnable": "Y"
// 	}]
// },
// {
// 	"id": "3",
// 	"lob": "Bike",
// 	"coverageAmount": "100000",
// 	"riders": [{
// 		"riderId": 6,
// 		"riderName": "Zero Depreciation cover",
// 		"riderAmount": 0
// 	},
// 	{
// 		"riderId": 2,
// 		"riderName": "Passenger Cover",
// 		"riderAmount": 0
// 	}]
// },
// {
// 	"id": "4",
// 	"lob": "Health",
// 	"coverageAmount": "100000",
// 	"riders": [{
// 		"riderId": 6,
// 		"riderName": "Ctritical Illness",
// 		"riderAmount": 0
// 	},
// 	{
// 		"riderId": 2,
// 		"riderName": "Hospitilization Cash Benifit",
// 		"riderAmount": 0
// 	}]
// },
// {
// 	"id": "1",
// 	"lob": "Life",
// 	"coverageAmount": "100000",
// 	"riders": [{
// 		"riderId": 6,
// 		"riderName": "Ctritical Illness",
// 		"riderAmount": 0
// 	},
// 	{
// 		"riderId": 2,
// 		"riderName": "Hospitilization Cash Benifit",
// 		"riderAmount": 0
// 	}]
// }];


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


preExistingCoveragesGeneric = [{ value: 24, display: "Covered after 2 years", name: "Pre-Existing Coverage", featureId: 60, "category": "Pre-existing cover", "subCategory": "2 years and less" },
{ value: 36, display: "Covered after 3 years", name: "Pre-Existing Coverage", featureId: 60, "category": "Pre-existing cover", "subCategory": "2-3 years" },
{ value: 48, display: "Covered after 4 years", name: "Pre-Existing Coverage", featureId: 60, "category": "Pre-existing cover", "subCategory": "4 years and more" }];






/* Below lists are for IT professionals */


itProfessionSpecializationList = [{ 'label': 'Design & Creatives', 'value': 'Design & Creatives' },
{ 'label': 'Consulting', 'value': 'Consulting'},
{ 'label': 'Data & Analytics', 'value': 'Data & Analytics'},
{ 'label': 'Software Development', 'value': 'Software Development'},
{ 'label': 'Product', 'value': 'Product'},
{ 'label': 'Business Process Management', 'value': 'Business Process Management'},
{ 'label': 'Infrastructure Management', 'value': 'Infrastructure Management'},
{ 'label': 'Project Management', 'value': 'Project Management'},
{ 'label': 'Testing', 'value': 'Testing'},
{'label':'Tech Startup','value':'Tech Startup'},
{ 'label': 'Other', 'value': 'Other', 'skipTo': 'ngo', 'skippedFrom': 'specialisation','skippedParams':['professionalLiability','clinicStatus']}];


itProfessionalLiabilityList = [{ 'label': 'OWN CONSULTING', 'value': 'Own Consulting' }, { 'label': 'WORK FOR A COMPANY', 'value': 'Work for a Company', 'skipTo': 'ngo', 'skippedFrom': 'personalLibility','skippedParams':['clinicStatus']}, { 'label': 'BOTH', 'value': 'Both' }];




/* List for IT is done */


/*Below lists are for CA professionals*/

caProfessionSpecializationList = [{ 'label': 'Chartered Accountant', 'value': 'Chartered Accountant' },
{ 'label': 'CFO', 'value': 'CFO'},
{ 'label': 'Equity and Mutual Funds', 'value': 'Equity and Mutual Funds'},
{ 'label': 'Insurance', 'value': 'Insurance'},
{ 'label': 'Investment Banking', 'value': 'Investment Banking'},
{ 'label': 'Retail Banking', 'value': 'Retail Banking'},
{ 'label': 'Treasury', 'value': 'Treasury'},
{ 'label': 'Taxation', 'value': 'Taxation'},
{ 'label': 'Other', 'value': 'Other'}];


caProfessionalLiabilityList = [{ 'label': 'OWN PRACTICE', 'value': 'Own Practice' }, { 'label': 'WORK FOR A COMPANY', 'value': 'Work for a Company', 'skipTo': 'ngo', 'skippedFrom': 'personalLibility','skippedParams':['clinicStatus']}, { 'label': 'BOTH', 'value': 'Both' }];



/* List for CA is done */

/* Below lists are for Retail & E-Commerce profession */
retailProfessionSpecializationList=[{'label':'Courier Service','value':'Courier Service'},
{'label':'Dealership','value':'Dealership'},
{'label':'Small retail business','value':'Small retail business'},
{'label':'Large retail chain','value':'Large retail chain'},
{'label':'Others','value':'Others'}];

retailProfessionLiabilityList=[{'label':'Own business','value':'Own business'},{'label':'Work for a Company','value':'Work for a Company' ,'skipTo': 'ngo', 'skippedFrom': 'personalLibility','skippedParams':['clinicStatus']}];

/* List for Retail & E-Commerce is done*/

/* Below lists are for FreeLancers profession */
freelancerProfessionSpecializationList=[{'label':'Art & Music','value':'Art & Music'},
{'label':'Consulting','value':'Consulting'},
{'label':'Beauty & Personal Care','value':'Beauty & Personal Care'},
{'label':'Dance & Choreography','value':'Dance & Choreography'},
{'label':'Fitness & Sports','value':'Fitness & Sports'},
{'label':'Marketing & Contents','value':'Marketing & Contents'},
{'label':'NGO & Public Service','value':'NGO & Public Service'},
{'label':'Party Planning','value':'Party Planning'},
{'label':'Small Business','value':'Small Business'},
{'label':'Other','value':'Other'}];

freelancerProfessionLiabilityList=[{'label':'Own business','value':'Own business'},{'label':'Work for a Company','value':'Work for a Company'}];

/* List for FreeLancers is done*/

/* Below lists are for Educators profession */
educatorProfessionSpecializationList=[{'label':'Day Care','value':'Day Care'},
{'label':'Primary School','value':'Primary School'},
{'label':'High School','value':'High School'},
{'label':'Degree College','value':'Degree College'},
{'label':'Engineering College','value':'Engineering College'},
{'label':'Medical College','value':'Medical College'},
{'label':'Other','value':'Other'}];

educatorProfessionLiabilityList=[{'label':'Own Tuition','value':'Own Tuition'},{'label':'Work for an Institution','value':'Work for an Institution','skipTo': 'ngo', 'skippedFrom': 'personalLibility','skippedParams':['clinicStatus']}];
/* List for Educators is done*/

/* Below lists are for Government & Public  Sector profession */
govtProfessionSpecializationist=[{'label':'Central Government','value':'Central Government'},
{'label':'Public Sector Banking','value':'Public Sector Banking'},
{'label':'Public Sector Non Banking','value':'Public Sector Non Banking'},
{'label':'State Government','value':'State Government'},
{'label':'Other','value':'Other'}];

/* List for Government & Public  Sector is done*/

/* Below lists are for Hospitality & Entertainment profession */
hospitalityProfessionSpecializationList=[{'label':'Restaurant & Food','value':'Restaurant & Food'},
{'label':'Event Management','value':'Event Management'},
{'label':'Motion Pictures','value':'Motion Pictures'},
{'label':'Music','value':'Music'},
{'label':'Broadcasting','value':'Broadcasting'},
{'label':'Other','value':'Other'}];

hospitalityProfessionLiabilityList=[{'label':'Own business','value':'Own business'},{'label':'Work for a Company','value':'Work for a Company','skipTo': 'ngo', 'skippedFrom': 'personalLibility','skippedParams':['clinicStatus']}];
/* List for Hospitality&Entertainment is done*/

/* Below lists are for Legal&Advocate profession */
legalProfessionSpecializationList=[{'label':'Company Law','value':'Company Law'},
{'label':'Criminal Law','value':'Criminal Law'},
{'label':'Family Law','value':'Family Law'},
{'label':'Civil Law','value':'Civil Law'},
{'label':'Patent and IP','value':'Patent and IP'},
{'label':'Real Estate Law','value':'Real Estate Law'},
{'label':'Other','value':'Other'}];

legalProfessionLiabilityList=[{'label':'Own Practice','value':'Own Practice'},{'label':'Work for a Company','value':'Work for a Company','skipTo': 'ngo', 'skippedFrom': 'personalLibility','skippedParams':['clinicStatus']},{'label':'Both','value':'Both'}];
/* List for Legal&Advocate is done*/


/* Below list is  for Manufacturing profession */
manufacturingProfessionSpecializationList=[{'label':'Micro','value':'Micro'},
{'label':'Small','value':'Small'},
{'label':'Medium','value':'Medium'},
{'label':'Large','value':'Large'},
{'label':'Other','value':'Other'}];
/* List for Manufacturing  is done*/

/* Below list is  for RealEstate & Architecture profession */
realEstateProfessionSpecializationList=[{'label':'Architect','value':'Architect'},
{'label':'Broker','value':'Broker'},
{'label':'Builder','value':'Builder'},
{'label':'Commercial Renting','value':'Commercial Renting'},
{'label':'Civil Engineer','value':'Civil Engineer'},
{'label':'Civil Contractor','value':'Civil Contractor'},
{'label':'Interior Designer','value':'Interior Designer'},
{'label':'Other','value':'Other'}];

realEstateProfessionLiabilityList=[{'label':'Own Practice','value':'Own Practice'},{'label':'Work for a Company','value':'Work for a Company','skipTo': 'ngo', 'skippedFrom': 'personalLibility','skippedParams':['clinicStatus']},{'label':'Both','value':'Both'}];
/* List for RealEstate & Architecture  is done*/

/* Below list is  for ArmedForces profession */
armedForcesProfessionSpecializationList=[{'label':'Army','value':'Army'},
{'label':'Navy','value':'Navy'},
{'label':'Air-force','value':'Air-force'},
{'label':'Defence Colleges','value':'Defence Colleges'},
{'label':'Coast Guard','value':'Coast Guard'}]
/* List for ArmedForces  is done*/
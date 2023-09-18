var travelProposalRequestDef = {
		"premiumDetails" : {
		},
		"proposerDetails" : {
			"salutation" : "",
			"firstName" : "",
			"lastName" : "",
			"dateOfBirth" : "",
			"gender" : "",
			"mobileNumber" : "",
			"emailId" : "",
			"maritalStatus":"",
			"isCommuniationAddressSameAsPermanant" : "Y",
			"communicationAddress" : {
				"houseNo":"",
				"addressLine" : "",
				"city" : "",
				"state" : "",
				"pincode" : ""
			},
			"permanantAddress" : {
				"houseNo":"",
				"addressLine" : "",
				"city" : "",
				"state" : "",
				"pincode" : ""
			}
		},
		"travelDetails" : {
			"tripType" : "",
			"source" : "",
			"destinations" : [
				{
					"country" : "",
					"countryCode" : "",
					"continent" : "",
					"continentCode" : "",
				}
			],	
			"startDate" : "",
			"endDate" : "",
			"policyTerm" : "",
			"policyTermIn" : ""
		},
		"travellerDetails" : [
			{
				"id" : "",
				"salutation" : "",
				"firstName" : "",
				"lastName" : "",
				"dateOfBirth" : "",
				"gender" : "",
				"mobileNo" : "",
				"emailId" : "",
				"passportNo" : "",
				"aadharNo" : "",
				"pancardNo" : "",
				"nomineeDetails" : {
					"firstName" : "",
					"lastName" : "",
					"dateOfBirth" : "",
					"gender" : "",
					"relation" : "",
				},
				"appointeeDetails" : {
					"firstName" : "",
					"lastName" : "",
					"dateOfBirth" : "",
					"gender" : "",
					"relation" : "",
				},
				"medicalDetails":{}
			}
		]		
};

var diseaseListGen = [
        {
			"description": "Abdomen related",
			"disease": "Abdomen related",
			"diseaseCode": "ABRE",
			"diseaseType": "OrganDonar",
			"diseaseId": 13
		},
		{
			"description": "Alzheimer disease",
			"disease": "Alzheimer disease",
			"diseaseCode": "ALDI",
			"diseaseType": "Critical",
			"diseaseId": 15
		},
		{
			"description": "Arthritis",
			"disease": "Arthritis",
			"diseaseCode": "ARTH",
			"diseaseType": "Other",
			"diseaseId": 10
		},
		{
			"description": "Asthma",
			"disease": "Asthma",
			"diseaseCode": "ASTH",
			"diseaseType": "Other",
			"diseaseId": 4
		},
		{
			"description": "Brain & Spinal cord disorders",
			"disease": "Brain & Spinal cord disorders",
			"diseaseCode": "BASD",
			"diseaseType": "Critical",
			"diseaseId": 11
		},
		{
			"description": "Cancer",
			"disease": "Cancer",
			"diseaseCode": "CANC",
			"diseaseType": "Critical",
			"diseaseId": 12
		},
		{
			"description": "Diabetes",
			"disease": "Diabetes",
			"diseaseCode": "DIAB",
			"diseaseType": "Other",
			"diseaseId": 1
		},
		{
			"description": "Ear, Nose & Throat related",
			"disease": "Ear, Nose & Throat related",
			"diseaseCode": "ENTR",
			"diseaseType": "Other",
			"diseaseId": 3
		},
		{
			"description": "Gynaecology",
			"disease": "Gynaecology",
			"diseaseCode": "GYNA",
			"diseaseType": "Other",
			"diseaseId": 7
		},
		{
			"description": "Heart ailments",
			"disease": "Heart ailments",
			"diseaseCode": "HEAL",
			"diseaseType": "Other",
			"diseaseId": 5
		},
		{
			"description": "High cholesterol",
			"disease": "High cholesterol",
			"diseaseCode": "CODI",
			"diseaseType": "Other",
			"diseaseId": 8
		},
		{
			"description": "Hypertension",
			"disease": "Hypertension",
			"diseaseCode": "HYPE",
			"diseaseType": "Other",
			"diseaseId": 9
		},
		{
			"description": "Kidney related",
			"disease": "Kidney related",
			"diseaseCode": "KIRE",
			"diseaseType": "OrganDonar",
			"diseaseId": 14
		},
		{
			"description": "Parkinson's disease",
			"disease": "Parkinson's disease",
			"diseaseCode": "PADI",
			"diseaseType": "Critical",
			"diseaseId": 16
		},
		{
			"description": "Psychiatric disorders",
			"disease": "Psychiatric disorders",
			"diseaseCode": "PSDI",
			"diseaseType": "Critical",
			"diseaseId": 17
		},
		{
			"description": "Thyroid disorder",
			"disease": "Thyroid disorder",
			"diseaseCode": "THYD",
			"diseaseType": "Other",
			"diseaseId": 2
		},
		{
			"description": "Tuberculosis",
			"disease": "Tuberculosis",
			"diseaseCode": "TUBE",
			"diseaseType": "Other",
			"diseaseId": 6
		}
		];

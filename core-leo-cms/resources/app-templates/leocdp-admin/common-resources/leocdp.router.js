/**
 * 
 * @author tantrieuf31 (Thomas)
 * 
 * this script contains all functional web-app routers for CDP end-users
 * 
 */

LeoCdpAdmin.navRouters = {
		"defaultRouter" : {
			"menuName" : "Marketing Dashboard",
			"functionName" : "loadMarketing360Dashboard",
			"breadcrumb" : ["Unified Marketing Hub", "Marketing Dashboard"]
		},
		
		// 1.1 Targeted Persona
		"Customer_Persona_List" : {
			"menuName" : "Customer Persona List",
			"functionName" : "loadCustomerPersonaList",
			"breadcrumb" : ["Customer Journey Map", "Customer Persona List"]
		},
		"Customer_Persona_Report" : {
			"menuName" : "Customer Persona Report",
			"functionName" : "loadCustomerPersonaReport",
			"breadcrumb" : ["Customer Journey Map", "Customer Persona List", "Persona Report"]
		},
		"Customer_Persona_Editor" : {
			"menuName" : "Customer Persona Details",
			"functionName" : "loadCustomerPersonaDetails",
			"breadcrumb" : ["Customer Journey Map", "Customer Persona List", "Persona Editor"]
		},
		
		// 1.2 Journey Map List, Report and Editor
		"Customer_Journey_List" : {
			"menuName" : "Customer Journey List",
			"functionName" : "loadCustomerJourneyList",
			"breadcrumb" : ["Customer Journey Map", "Customer Journey List"]
		},
		"Journey_Map_Report" : {
			"menuName" : "Journey Map Report",
			"functionName" : "loadJourneyMapReport",
			"breadcrumb" : ["Customer Journey Map", "Customer Journey List", "Journey Map Report"]
		},
		"Journey_Map_Studio" : {
			"menuName" : "Journey Map Studio",
			"functionName" : "loadJourneyMapStudio",
			"breadcrumb" : ["Customer Journey Map", "Customer Journey List","Journey Map Studio"]
		},
		
		// 1.3 Customer Touchpoint
		"Customer_Touchpoint_List" : {
			"menuName" : "Customer Touchpoint List",
			"functionName" : "loadCustomerTouchpointList",
			"breadcrumb" : ["Customer Journey Map", "Touchpoint List"]
		},
		"Customer_Touchpoint_Report" : {
			"menuName" : "Touchpoint Report",
			"functionName" : "loadCustomerTouchpointReport",
			"breadcrumb" : ["Customer Journey Map", "Customer Touchpoint List" , "Customer Touchpoint Report" ]
		},
		"Customer_Touchpoint_Editor" : {
			"menuName" : "Touchpoint Report",
			"functionName" : "loadCustomerTouchpointEditor",
			"breadcrumb" : ["Customer Journey Map", "Customer Touchpoint List" , "Customer Touchpoint Editor" ]
		},
		
		// 1.4 Data Observer for touchpoint
		"Data_Observer_List" : {
			"menuName" : "Data Observer List",
			"functionName" : "loadDataObserverList",
			"breadcrumb" : ["Customer Journey Map", "Data Observer List"]
		},
		"Data_Observer_Report" : {
			"menuName" : "Data Observer Report",
			"functionName" : "loadDataObserverReport",
			"breadcrumb" : ["Customer Journey Map", "Data Observer List", "Data Observer Report"]
		},
		"Data_Observer_Configs" : {
			"menuName" : "Data Observer Configs",
			"functionName" : "loadDataObserverConfigs",
			"breadcrumb" : ["Customer Journey Map", "Data Observer List", "Data Observer Configs"]
		},
		
		// 2.1 Unified Marketing Hub
		"Marketing_Dashboard": {
			"menuName" : "Marketing Dashboard",
			"functionName" : "loadMarketing360Dashboard",
			"breadcrumb" : ["Unified Marketing Hub", "Marketing Dashboard"]
		},
		
		// 2.2 Audience Profile 
		"Audience_Profile_List" : {
			"menuName" : "Audience Profile List",
			"functionName" : "loadAudienceProfileList",
			"breadcrumb" : ["Unified Marketing Hub", "Audience Profile List"]
		},
		"Audience_Profile_Report" : {
			"menuName" : "Audience Profile Report",
			"functionName" : "loadAudienceProfileReport",
			"breadcrumb" : ["Unified Marketing Hub", "Audience Profile List", "Audience Profile Report"]
		},
		"Audience_Profile_Editor" : {
			"menuName" : "Audience Profile Editor",
			"functionName" : "loadAudienceProfileEditor",
			"breadcrumb" : ["Unified Marketing Hub", "Audience Profile List", "Audience Profile Editor"]
		},
		
		// 2.3 Audience Segmentation
		"Audience_Segment_List" : {
			"menuName" : "Audience Segment List",
			"functionName" : "loadAudienceSegmentList",
			"breadcrumb" : ["Unified Marketing Hub", "Audience Segment List"]
		},
		"Audience_Segment_Report" : {
			"menuName" : "Audience Segment Report",
			"functionName" : "loadAudienceSegmentReport",
			"breadcrumb" : ["Unified Marketing Hub", "Audience Segment List", "Audience Segment Report"]
		},
		"Audience_Segment_Builder" : {
			"menuName" : "Audience Segment Builder",
			"functionName" : "loadAudienceSegmentBuilder",
			"breadcrumb" : ["Unified Marketing Hub", "Audience Segment List", "Audience Segment Builder"]
		},
		
		// 2.4 Product and Service Catalog
		"Products_and_Services" : {
			"menuName" : "Products and Services",
			"functionName" : "loadProductsAndServices",
			"breadcrumb" : ["Unified Marketing Hub", "Products & Services"]
		},
		"Product_Report" : {
			"menuName" : "Product Report",
			"functionName" : "loadProductReport",
			"breadcrumb" : ["Unified Marketing Hub", "Products & Services", "Product Report"]
		},
		"Service_Report" : {
			"menuName" : "Service Report",
			"functionName" : "loadServiceReport",
			"breadcrumb" : ["Unified Marketing Hub", "Products & Services", "Service Report"]
		},
		"Product_Data_Editor" : {
			"menuName" : "Product Data Editor",
			"functionName" : "loadProductDataEditor",
			"breadcrumb" : ["Unified Marketing Hub", "Products & Services", "Product Data Editor"]
		},
		"Product_Data_Editor" : {
			"menuName" : "Service Data Editor",
			"functionName" : "loadServiceDataEditor",
			"breadcrumb" : ["Unified Marketing Hub", "Products & Services", "Service Data Editor"]
		},
		
		// 3.1 Content Dashboard
		"Content_Dashboard" : {
			"menuName" : "Content Dashboard",
			"functionName" : "loadContentDashboard",
			"breadcrumb" : ["Creative Content Hub", "Content Dashboard"]
		},
		
		// 3.2 Creative Content Category
		"Content_Category_List" : {
			"menuName" : "Content Category List",
			"functionName" : "loadContentCategoryList",
			"breadcrumb" : ["Creative Content Hub", "Content Category List"]
		},
		
		// 4.1 Personalization AI Models 
		"Personalization_Models" : {
			"menuName" : "Personalization Models",
			"functionName" : "loadPersonalizationModels",
			"breadcrumb" : ["Personalization AI Hub", "Personalization AI Models"]
		},
		
		// 4.1 Personalization AI Widgets
		"Personalization_Widgets" : {
			"menuName" : "Personalization Widgets",
			"functionName" : "loadPersonalizationWidgets",
			"breadcrumb" : ["Personalization AI Hub", "Personalization Widgets"]
		},
		
		// 5.1 Voucher/Coupon Management
		"Coupon_Management" : {
			"menuName" : "Coupon Management",
			"functionName" : "loadCouponManagement",
			"breadcrumb" : ["Customer Activation", "Coupon Management"]
		},
		"Coupon_Report" : {
			"menuName" : "Coupon Report",
			"functionName" : "loadCouponReport",
			"breadcrumb" : ["Customer Activation", "Coupon Management", "Coupon Report"]
		},
		
		// 5.2 Email Marketing Activation Campaigns
		"Email_Campaigns" : {
			"menuName" : "Email Campaign List",
			"functionName" : "loadEmailCampaigns",
			"breadcrumb" : ["Customer Activation", "Email Campaigns"]
		},
		"Email_Campaign_Report" : {
			"menuName" : "Email Campaign Report",
			"functionName" : "loadEmailCampaignReport",
			"breadcrumb" : ["Customer Activation", "Email Campaigns", "Email Campaign Report"]
		},
		"Email_Campaign_Editor" : {
			"menuName" : "Email Campaign Editor",
			"functionName" : "loadEmailCampaignEditor",
			"breadcrumb" : ["Customer Activation", "Email Campaigns", "Email Campaign Editor"]
		},
		
		// 5.3 SMS Marketing Activation Campaigns
		"SMS_Campaigns" : {
			"menuName" : "SMS Campaign List",
			"functionName" : "loadSMSCampaigns",
			"breadcrumb" : ["Customer Activation", "SMS Campaigns"]
		},
		"SMS_Campaign_Report" : {
			"menuName" : "SMS Campaign Report",
			"functionName" : "loadSMSCampaignReport",
			"breadcrumb" : ["Customer Activation", "SMS Campaigns", "SMS Campaign Report"]
		},
		"SMS_Campaign_Editor" : {
			"menuName" : "SMS Campaign Editor",
			"functionName" : "loadSMSCampaignEditor",
			"breadcrumb" : ["Customer Activation", "SMS Campaigns", "SMS Campaign Editor"]
		},
		
		// User Login Management
		"User_Login_List" : {
			"menuName" : "User Login List",
			"functionName" : "loadUserLoginList",
			"breadcrumb" : ["System Management", "User Login List"]
		},
		"User_Login_Editor" : {
			"menuName" : "User Login Editor",
			"functionName" : "loadUserLoginEditor",
			"breadcrumb" : ["System Management", "User Login List","User Login Profile Editor"]
		},
		"System_Configuration" : {
			"menuName" : "System Configuration",
			"functionName" : "loadSystemInfoConfigs",
			"breadcrumb" : ["System Management", "System Configuration"]
		}
};

//###############################################################################################################################

function leoCdpRouter(objKey,objId){
	var obj = LeoCdpAdmin.navRouters[objKey];
	console.log( obj );
	
	// generate breadcrumb navigation
	var breadcrumbHtml = '';
	var titleNav = '';
	var breadcrumbList = obj.breadcrumb;
	var len = breadcrumbList.length;
	for(var i=0; i< len; i++ ){
		var name = breadcrumbList[i];
		titleNav  = titleNav + name + " - ";
		var key = name.replace(/ /g, "_");
		var jsFunc = LeoCdpAdmin.navRouters[key] ? "leoCdpRouter('"+ key + "')"  : "";
		breadcrumbHtml = breadcrumbHtml + '<a title="'+ name +'" href="#calljs-' + jsFunc + '"> ' + breadcrumbList[i] + ' </a> ';
		if( i < (len - 1) ){
			breadcrumbHtml = breadcrumbHtml + ' &#8594; ';
		}
	}
	
	var vf = LeoCdpAdmin.navFunctions[obj.functionName];
	
	if(typeof vf === 'function') {
		if(objId){
			console.log(objKey + " objId " + objId)
			vf.apply(null,[objId,breadcrumbHtml]);
		} else {
			console.log(objKey + " ")
			vf.apply(null,[breadcrumbHtml]);
		}
		document.title = titleNav;
	} else {
		console.error( " LeoCdpAdmin.navFunctions[obj.functionName] is not a function " );
		console.error( obj );
	}
	console.log( objId );
}


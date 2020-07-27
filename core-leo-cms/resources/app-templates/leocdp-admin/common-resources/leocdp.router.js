/**
 * 
 * @author tantrieuf31 (Thomas)
 * 
 * this script contains all functional web-app routers for CDP end-users
 * 
 */

LeoCdpAdmin.navRouters = {
		"defaultRouter" : {
			"menuName" : "Customer Profile List",
			"functionName" : "loadCustomerProfileList",
			"breadcrumb" : ["Customer Data Hub", "Customer Profile List"]
		},
		
		// 1.1 Main Analytics Dashboard
		"Marketing_Dashboard": {
			"menuName" : "Marketing Dashboard",
			"functionName" : "loadMarketingDashboard",
			"breadcrumb" : ["Unified Analytics Hub", "Marketing Dashboard"]
		},
		
		// 1.2 Targeted Persona
		"Customer_Persona_List" : {
			"menuName" : "Customer Persona List",
			"functionName" : "loadCustomerPersonaList",
			"breadcrumb" : ["Customer Journey Hub", "Customer Persona List"]
		},
		"Customer_Persona_Report" : {
			"menuName" : "Customer Persona Report",
			"functionName" : "loadCustomerPersonaReport",
			"breadcrumb" : ["Customer Journey Hub", "Customer Persona List", "Persona Report"]
		},
		"Customer_Persona_Editor" : {
			"menuName" : "Customer Persona Details",
			"functionName" : "loadCustomerPersonaDetails",
			"breadcrumb" : ["Customer Journey Hub", "Customer Persona List", "Persona Editor"]
		},
		
		// 1.3 Media Channel 
		"Media_Channel_List" : {
			"menuName" : "Media Channel List",
			"functionName" : "loadMediaChannelList",
			"breadcrumb" : ["Customer Journey Hub", "Media Channel List"]
		},
		"Media_Channel_Report" : {
			"menuName" : "Media Channel Report",
			"functionName" : "loadMediaChannelReport",
			"breadcrumb" : ["Customer Journey Hub", "Media Channel List" , "Media Channel Report" ]
		},
		"Media_Channel_Editor" : {
			"menuName" : "Media Channel Editor",
			"functionName" : "loadMediaChannelEditor",
			"breadcrumb" : ["Customer Journey Hub", "Media Channel List" , "Media Channel Editor" ]
		},
		
		// 1.4 Customer Touchpoint
		"Customer_Touchpoint_List" : {
			"menuName" : "Customer Touchpoint List",
			"functionName" : "loadCustomerTouchpointList",
			"breadcrumb" : ["Customer Journey Hub", "Touchpoint List"]
		},
		"Customer_Touchpoint_Report" : {
			"menuName" : "Touchpoint Report",
			"functionName" : "loadCustomerTouchpointReport",
			"breadcrumb" : ["Customer Journey Hub", "Customer Touchpoint List" , "Customer Touchpoint Report" ]
		},
		"Customer_Touchpoint_Editor" : {
			"menuName" : "Touchpoint Report",
			"functionName" : "loadCustomerTouchpointEditor",
			"breadcrumb" : ["Customer Journey Hub", "Customer Touchpoint List" , "Customer Touchpoint Editor" ]
		},
		
		// 1.5 Event Metrics for Media Channel and Touchpoint
		"Event_Metrics" : {
			"menuName" : "Event Metrics",
			"functionName" : "loadEventMetrics",
			"breadcrumb" : ["Customer Journey Hub", "Event Metrics"]
		},
		
		// 1.6 Data Observer for touchpoint and media channel
		"Data_Observer_List" : {
			"menuName" : "Data Observer List",
			"functionName" : "loadDataObserverList",
			"breadcrumb" : ["Customer Journey Hub", "Data Observer List"]
		},
		"Data_Observer_Report" : {
			"menuName" : "Data Observer Report",
			"functionName" : "loadDataObserverReport",
			"breadcrumb" : ["Customer Journey Hub", "Data Observer List", "Data Observer Report"]
		},
		"Data_Observer_Configs" : {
			"menuName" : "Data Observer Configs",
			"functionName" : "loadDataObserverConfigs",
			"breadcrumb" : ["Customer Journey Hub", "Data Observer List", "Data Observer Configs"]
		},
		
		// 1.7 Journey Map List, Report and Editor
		"Customer_Journey_List" : {
			"menuName" : "Customer Journey List",
			"functionName" : "loadCustomerJourneyList",
			"breadcrumb" : ["Customer Journey Hub", "Customer Journey List"]
		},
		"Journey_Map_Report" : {
			"menuName" : "Journey Map Report",
			"functionName" : "loadJourneyMapReport",
			"breadcrumb" : ["Customer Journey Hub", "Customer Journey List", "Journey Map Report"]
		},
		"Journey_Map_Studio" : {
			"menuName" : "Journey Map Studio",
			"functionName" : "loadJourneyMapStudio",
			"breadcrumb" : ["Customer Journey Hub", "Customer Journey List","Journey Map Studio"]
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
		
		
		// 3.1 Customer Profile 
		"Customer_Profile_List" : {
			"menuName" : "Customer Profile List",
			"functionName" : "loadCustomerProfileList",
			"breadcrumb" : ["Customer Data Hub", "Customer Profile List"]
		},
		"Customer_Profile_Report" : {
			"menuName" : "Customer Profile Report",
			"functionName" : "loadCustomerProfileReport",
			"breadcrumb" : ["Customer Data Hub", "Customer Profile List", "Customer Profile Report"]
		},
		"Customer_Profile_Editor" : {
			"menuName" : "Customer Profile Editor",
			"functionName" : "loadCustomerProfileEditor",
			"breadcrumb" : ["Customer Data Hub", "Customer Profile List", "Customer Profile Editor"]
		},
		
		// 3.2 Customer Segmentation
		"Customer_Segment_List" : {
			"menuName" : "Customer Segment List",
			"functionName" : "loadCustomerSegmentList",
			"breadcrumb" : ["Customer Data Hub", "Customer Segment List"]
		},
		"Customer_Segment_Report" : {
			"menuName" : "Customer Segment Report",
			"functionName" : "loadCustomerSegmentReport",
			"breadcrumb" : ["Customer Data Hub", "Customer Segment List", "Customer Segment Report"]
		},
		"Customer_Segment_Builder" : {
			"menuName" : "Customer Segment Builder",
			"functionName" : "loadCustomerSegmentBuilder",
			"breadcrumb" : ["Customer Data Hub", "Customer Segment List", "Customer Segment Builder"]
		},
		
		// 3.3 Customer Data Export
		"Customer_Data_Export" : {
			"menuName" : "Customer Data Export",
			"functionName" : "loadCustomerDataExport",
			"breadcrumb" : ["Customer Data Hub", "Customer Data Export"]
		},
		
		// 3.4 Product and Service Catalog
		"Products_and_Services" : {
			"menuName" : "Products and Services",
			"functionName" : "loadProductsAndServices",
			"breadcrumb" : ["Customer Data Hub", "Products & Services"]
		},
		"Product_Report" : {
			"menuName" : "Product Report",
			"functionName" : "loadProductReport",
			"breadcrumb" : ["Customer Data Hub", "Products & Services", "Product Report"]
		},
		"Service_Report" : {
			"menuName" : "Service Report",
			"functionName" : "loadServiceReport",
			"breadcrumb" : ["Customer Data Hub", "Products & Services", "Service Report"]
		},
		"Product_Data_Editor" : {
			"menuName" : "Product Data Editor",
			"functionName" : "loadProductDataEditor",
			"breadcrumb" : ["Customer Data Hub", "Products & Services", "Product Data Editor"]
		},
		"Product_Data_Editor" : {
			"menuName" : "Service Data Editor",
			"functionName" : "loadServiceDataEditor",
			"breadcrumb" : ["Customer Data Hub", "Products & Services", "Service Data Editor"]
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
		
		// 5.3 Push Message Marketing Activation Campaigns
		"Push_Message_Campaigns" : {
			"menuName" : "Push Message Campaigns",
			"functionName" : "loadPushMessageCampaigns",
			"breadcrumb" : ["Customer Activation", "Push Message Campaigns"]
		},
		"Push_Message_Campaign_Report" : {
			"menuName" : "Push Message Campaign Report",
			"functionName" : "loadPushMessageCampaignReport",
			"breadcrumb" : ["Customer Activation", "Push Message Campaigns", "Campaign Report"]
		},
		"Push_Message_Campaign_Editor" : {
			"menuName" : "Push Message Campaign Editor",
			"functionName" : "loadPushMessageCampaignEditor",
			"breadcrumb" : ["Customer Activation", "Push Message Campaigns", "Campaign Editor"]
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
		"My_Login_Info" : {
			"menuName" : "My Login Information",
			"functionName" : "loadMyLoginInfo",
			"breadcrumb" : ["My Login Information"]
		},
		"System_Configuration" : {
			"menuName" : "System Configuration",
			"functionName" : "loadSystemInfoConfigs",
			"breadcrumb" : ["System Management", "System Configuration"]
		}
};

//###############################################################################################################################

LeoCdpAdmin.routerContext = {}

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
		
		if( i < (len - 1) ){
			breadcrumbHtml = breadcrumbHtml + '<a title="'+ name +'" href="#calljs-' + jsFunc + '"> ' + breadcrumbList[i] + ' </a> ';
			breadcrumbHtml = breadcrumbHtml + ' &#8594; ';
		} else {
			breadcrumbHtml = breadcrumbHtml + '<a title="'+ name +'" href="#calljs-"> ' + breadcrumbList[i] + ' </a> ';
		}
	}
	
	var vf = LeoCdpAdmin.navFunctions[obj.functionName];
	
	if(typeof vf === 'function') {
		if(objId){
			console.log(objKey + " objId " + objId)
			LeoCdpAdmin.routerContext.objId = objId;
			vf.apply(null,[objId,breadcrumbHtml]);
		} else {
			console.log(objKey + " ")
			LeoCdpAdmin.routerContext.objId = false;
			vf.apply(null,[breadcrumbHtml]);
		}
		document.title = titleNav;
	} else {
		console.error( " LeoCdpAdmin.navFunctions[obj.functionName] is not a function " );
		console.error( obj );
	}
	console.log( objId );
}

function gotoLeoCdpRouter(){
	var paramStr = '';
	for(var i=0; i < arguments.length; i++){
		paramStr = paramStr +  "'" +  arguments[i];
		if( i+1 < arguments.length ){
			paramStr +=  "'," ;
		} else {
			paramStr +=  "'" ;
		}
	}
	var hash = 'calljs-leoCdpRouter(' + paramStr  + ")";
	location.hash = hash;
}


/**
 * 
 * @author tantrieuf31 (Thomas)
 * 
 * this script contains all functional web-app routers for CDP end-users
 * 
 */

LeoCdpAdmin.navRouters = {
		"defaultRouter" : {
			"menuName" : "Primary Dashboard",
			"functionName" : "loadPrimaryDashboard",
			"breadcrumb" : ["Unified Analytics Hub", "Primary Dashboard"],
			"activeMenuItem" : "Primary_Dashboard"
		},
		
		// 0  Main Analytics Dashboard
		"Learn_Leo_CDP": {
			"menuName" : "Self-Learning Courses",
			"functionName" : "loadSelfLearningCourses",
			"breadcrumb" : ["Leo CDP Knowledge Base", "Self-Learning Courses"],
			"activeMenuItem" : "USPA_Knowledge_Hub"
		},
		
		// 1.1 Main Analytics Dashboard
		"Primary_Dashboard": {
			"menuName" : "Primary Dashboard",
			"functionName" : "loadPrimaryDashboard",
			"breadcrumb" : ["Unified Analytics Hub", "Primary Dashboard"],
			"activeMenuItem" : "Primary_Dashboard"
		},
		
		// 1.2 TODO Content Dashboard
		"Content_Dashboard" : {
			"menuName" : "Content Dashboard",
			"functionName" : "loadContentDashboard",
			"breadcrumb" : ["Creative Content Hub", "Content Dashboard"]
		},
		
		// 1.3 Analytics 360 Notebooks
		"Analytics_360_Notebooks": {
			"menuName" : "Analytics 360 Notebooks",
			"functionName" : "loadAnalytics360Notebooks",
			"breadcrumb" : ["Unified Analytics Hub", "Analytics 360 Notebooks"],
			"activeMenuItem" : "Analytics_360_Notebooks"
		
		},
		
		// 2.1 Targeted Persona
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
		
		// 2.2 Media Channel 
		"Media_Journey_Map" : {
			"menuName" : "Media Journey Map",
			"functionName" : "loadMediaJourneyMap",
			"breadcrumb" : ["Customer Journey Hub", "Media Journey Map"],
			"activeMenuItem" : "Media_Journey_Map"
		},
		"Media_Channel_Report" : {
			"menuName" : "Media Channel Report",
			"functionName" : "loadMediaChannelReport",
			"breadcrumb" : ["Customer Journey Hub", "Media Journey Map" , "Media Channel Report" ],
			"activeMenuItem" : "Media_Journey_Map"
		},
		"Media_Channel_Editor" : {
			"menuName" : "Media Channel Editor",
			"functionName" : "loadMediaChannelEditor",
			"breadcrumb" : ["Customer Journey Hub", "Media Journey Map" , "Media Channel Editor" ],
			"activeMenuItem" : "Media_Journey_Map"
		},
		
		// 2.3 Customer Touchpoint
		"Customer_Touchpoint_List" : {
			"menuName" : "Customer Touchpoint List",
			"functionName" : "loadCustomerTouchpointList",
			"breadcrumb" : ["Customer Journey Hub", "Touchpoint List"],
			"activeMenuItem" : "Media_Journey_Map"
		},
		"Customer_Touchpoint_Report" : {
			"menuName" : "Touchpoint Report",
			"functionName" : "loadCustomerTouchpointReport",
			"breadcrumb" : ["Customer Journey Hub", "Customer Touchpoint List" , "Customer Touchpoint Report" ],
			"activeMenuItem" : "Media_Journey_Map"
		},
		"Customer_Touchpoint_Editor" : {
			"menuName" : "Touchpoint Report",
			"functionName" : "loadCustomerTouchpointEditor",
			"breadcrumb" : ["Customer Journey Hub", "Customer Touchpoint List" , "Customer Touchpoint Editor" ],
			"activeMenuItem" : "Media_Journey_Map"
		},
		
		// 2.4 Event Metrics for Media Channel and Touchpoint
		"Behavioral_Event_Metrics" : {
			"menuName" : "Behavioral Event Metrics",
			"functionName" : "loadBehavioralEventMetrics",
			"breadcrumb" : ["Customer Journey Hub", "Behavioral Event Metrics"],
			"activeMenuItem" : "Behavioral_Event_Metrics"
		},
		
		// 2.5 Data Observer for touchpoint and media channel
		"Leo_Observer_List" : {
			"menuName" : "Leo Observer List",
			"functionName" : "loadLeoObserverList",
			"breadcrumb" : ["Customer Journey Hub", "Leo Observer List"],
			"activeMenuItem" : "Leo_Observer_List"
		},
		"Data_Observer_Report" : {
			"menuName" : "Data Observer Report",
			"functionName" : "loadDataObserverReport",
			"breadcrumb" : ["Customer Journey Hub", "Data Observer List", "Data Observer Report"],
			"activeMenuItem" : "Leo_Observer_List"
		},
		"Data_Observer_Configs" : {
			"menuName" : "Data Observer Configs",
			"functionName" : "loadDataObserverConfigs",
			"breadcrumb" : ["Customer Journey Hub", "Data Observer List", "Data Observer Configs"],
			"activeMenuItem" : "Leo_Observer_List"
		},
		
		// 2.6 Journey Map List, Report and Editor
		"Journey_Map_List" : {
			"menuName" : "Journey Map List",
			"functionName" : "loadJourneyMapList",
			"breadcrumb" : ["Customer Journey Hub", "Journey Map List"],
			"activeMenuItem" : "Media_Journey_Map"
		},
		"Journey_Map_Report" : {
			"menuName" : "Journey Map Report",
			"functionName" : "loadJourneyMapReport",
			"breadcrumb" : ["Customer Journey Hub", "Journey Map List", "Journey Map Report"],
			"activeMenuItem" : "Media_Journey_Map"
		},
		"Journey_Map_Studio" : {
			"menuName" : "Journey Map Studio",
			"functionName" : "loadJourneyMapStudio",
			"breadcrumb" : ["Customer Journey Hub", "Journey Map List","Journey Map Studio"],
			"activeMenuItem" : "Media_Journey_Map"
		},
		
		// 2.7 TODO Product and Service Catalog
		"Products_and_Services" : {
			"menuName" : "Products and Services",
			"functionName" : "loadProductsAndServices",
			"breadcrumb" : ["Customer Journey Hub", "Products & Services"],
			"activeMenuItem" : "Media_Journey_Map"
		},
		"Product_Report" : {
			"menuName" : "Product Report",
			"functionName" : "loadProductReport",
			"breadcrumb" : ["Customer Journey Hub", "Products & Services", "Product Report"],
			"activeMenuItem" : "Media_Journey_Map"
		},
		"Service_Report" : {
			"menuName" : "Service Report",
			"functionName" : "loadServiceReport",
			"breadcrumb" : ["Customer Journey Hub", "Products & Services", "Service Report"],
			"activeMenuItem" : "Media_Journey_Map"
		},
		"Product_Data_Editor" : {
			"menuName" : "Product Data Editor",
			"functionName" : "loadProductDataEditor",
			"breadcrumb" : ["Customer Journey Hub", "Products & Services", "Product Data Editor"],
			"activeMenuItem" : "Media_Journey_Map"
		},
		"Product_Data_Editor" : {
			"menuName" : "Service Data Editor",
			"functionName" : "loadServiceDataEditor",
			"breadcrumb" : ["Customer Journey Hub", "Products & Services", "Service Data Editor"],
			"activeMenuItem" : "Media_Journey_Map"
		},
		
		// 2.8 Content Marketing List
		"Content_Category_List" : {
			"menuName" : "Content Category List",
			"functionName" : "loadContentCategoryList",
			"breadcrumb" : ["Customer Journey Hub", "Content Category List"],
			"activeMenuItem" : "Content_Category_List"
		},
		
		// 2.9 Content Marketing Pages
		"Pages_in_Category" : {
			"menuName" : "Pages in Category",
			"functionName" : "loadPagesInCategory",
			"breadcrumb" : ["Customer Journey Hub", "Content Category List", "Pages in Category"],
			"activeMenuItem" : "Content_Category_List"
		},
		
		// 2.10 Content Page Information with Posts
		"Page_Info" : {
			"menuName" : "Page Information",
			"functionName" : "loadPageInfo",
			"breadcrumb" : ["Customer Journey Hub", "Content Category List", "Pages in Category","Page Information"],
			"activeMenuItem" : "Content_Category_List"
		},
		
		// 4.1 Customer Profile 
		"Customer_Profile_List" : {
			"menuName" : "Customer Profile List",
			"functionName" : "loadCustomerProfileList",
			"breadcrumb" : ["Customer Data Hub", "Customer Profile List"],
			"activeMenuItem" : "Customer_Profile_List"
		},
		"Customer_Profile_Info" : {
			"menuName" : "Customer Profile Report",
			"functionName" : "loadCustomerProfileInfo",
			"breadcrumb" : ["Customer Data Hub", "Customer Profile List", "Customer Profile Report"],
			"activeMenuItem" : "Customer_Profile_List"
		},
		"Customer_Profile_Editor" : {
			"menuName" : "Customer Profile Editor",
			"functionName" : "loadCustomerProfileEditor",
			"breadcrumb" : ["Customer Data Hub", "Customer Profile List", "Customer Profile Editor"],
			"activeMenuItem" : "Customer_Profile_List"
		},
		
		// 4.2 Customer Segmentation
		"Segment_List" : {
			"menuName" : "Segment List",
			"functionName" : "loadSegmentList",
			"breadcrumb" : ["Customer Data Hub", "Segment List"],
			"activeMenuItem" : "Customer_Segment_List"
		},
		"Segment_Report" : {
			"menuName" : "Segment Report",
			"functionName" : "loadCustomerSegmentReport",
			"breadcrumb" : ["Customer Data Hub", "Segment List", "Segment Report"],
			"activeMenuItem" : "Customer_Segment_List"
		},
		"Segment_Builder" : {
			"menuName" : "Segment Builder",
			"functionName" : "loadCustomerSegmentBuilder",
			"breadcrumb" : ["Customer Data Hub", "Segment List", "Segment Builder"],
			"activeMenuItem" : "Customer_Segment_List"
		},
		
		// 4.3 Customer Data Import from tab-separated values (TSV) file 
		"Customer_Data_Import" : {
			"menuName" : "Customer Data Import",
			"functionName" : "loadCustomerDataImport",
			"breadcrumb" : ["Customer Data Hub", "Customer Data Import"],
			"activeMenuItem" : "Customer_Data_Import"
		},
		
		// 4.4 Customer Data Export to tab-separated values (TSV) file
		"Customer_Data_Export" : {
			"menuName" : "Customer Data Export",
			"functionName" : "loadCustomerDataExport",
			"breadcrumb" : ["Customer Data Hub", "Customer Data Export"],
			"activeMenuItem" : "Customer_Data_Export"
		},
		
		// 4.1 Personalization AI Models 
		"Personalization_Models" : {
			"menuName" : "Personalization Models",
			"functionName" : "loadPersonalizationModels",
			"breadcrumb" : ["Personalization AI Hub", "Personalization AI Models"],
			"activeMenuItem" : "Customer_Segment_List"
		},
		
		// 4.1 Personalization AI Widgets
		"Personalization_Widgets" : {
			"menuName" : "Personalization Widgets",
			"functionName" : "loadPersonalizationWidgets",
			"breadcrumb" : ["Personalization AI Hub", "Personalization Widgets"],
			"activeMenuItem" : "Customer_Segment_List"
		},
		
		// 5.1 Voucher/Coupon Management
		"Activation_Rules" : {
			"menuName" : "Activation Rules",
			"functionName" : "loadActivationRules",
			"breadcrumb" : ["Customer Activation", "Activation Rules"]
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
			"breadcrumb" : ["System Management", "User Login List"],
			"activeMenuItem" : "User_Login_List"
		},
		"User_Login_Editor" : {
			"menuName" : "User Login Editor",
			"functionName" : "loadUserLoginEditor",
			"breadcrumb" : ["System Management", "User Login List","User Login Profile Editor"],
			"activeMenuItem" : "User_Login_List"
		},
		"My_Login_Info" : {
			"menuName" : "My Login Information",
			"functionName" : "loadMyLoginInfo",
			"breadcrumb" : ["My Login Information"]
		},
		"System_Configuration" : {
			"menuName" : "System Configuration",
			"functionName" : "loadSystemInfoConfigs",
			"breadcrumb" : ["System Management", "System Configuration"],
			"activeMenuItem" : "System_Configuration"
		}
};
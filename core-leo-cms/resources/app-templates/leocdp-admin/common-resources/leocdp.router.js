/**
 * 
 * @author tantrieuf31 (Thomas)
 * 
 * this script contains all functional admin web view routers for CDP end-users
 * 
 */

LeoCdpAdmin.navRouters = {
		"defaultRouter" : {
			"menuName" : "Primary Dashboard",
			"functionName" : "loadMainDataDashboard",
			"breadcrumb" : ["Unified Analytics Hub", "Main Data Dashboard"],
			"activeMenuItem" : "Main_Data_Dashboard"
		},
		
		
		// 0  Knowledge-base for end-users
		"Learn_Leo_CDP": {
			"menuName" : "Self-Learning Courses",
			"functionName" : "loadSelfLearningCourses",
			"breadcrumb" : ["Leo CDP Knowledge Base", "Self-Learning Courses"],
			"activeMenuItem" : "USPA_Knowledge_Hub"
		},
		
		////////////////////////// 1) UNIFIED ANALYTICS MODULE //////////////////////////
		
		// 1.1 Main Data Analytics Dashboard
		"Main_Data_Dashboard": {
			"menuName" : "Main Data Dashboard",
			"functionName" : "loadMainDataDashboard",
			"breadcrumb" : ["Unified Analytics Hub", "Main Data Dashboard"],
			"activeMenuItem" : "Main_Data_Dashboard"
		},
		
		// 1.2 Analytics 360 Notebooks
		"Data_Science_Notebooks": {
			"menuName" : "Data Science Notebooks",
			"functionName" : "loadDataScienceNotebooks",
			"breadcrumb" : ["Unified Analytics Hub", "Data Science Notebooks"],
			"activeMenuItem" : "Data_Science_Notebooks"
		
		},
		
		////////////////////////// 2) JOURNEY DATA MODULE //////////////////////////
		
		// 2.1 Targeted Persona
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
		
		// 2.2 Media Channel 
		"Customer_Journey_Map" : {
			"menuName" : "Customer Journey Map",
			"functionName" : "loadDataJourneyMap",
			"breadcrumb" : ["Customer Journey Map", "Customer Journey Map"],
			"activeMenuItem" : "Customer_Journey_Map"
		},
		"Media_Channel_Report" : {
			"menuName" : "Media Channel Report",
			"functionName" : "loadMediaChannelReport",
			"breadcrumb" : ["Customer Journey Map", "Customer Journey Map" , "Media Channel Report" ],
			"activeMenuItem" : "Customer_Journey_Map"
		},
		"Media_Channel_Editor" : {
			"menuName" : "Media Channel Editor",
			"functionName" : "loadMediaChannelEditor",
			"breadcrumb" : ["Customer Journey Map", "Customer Journey Map" , "Media Channel Editor" ],
			"activeMenuItem" : "Customer_Journey_Map"
		},
		
		// 2.3 Customer Touchpoint
		"Customer_Touchpoint_List" : {
			"menuName" : "Customer Touchpoint List",
			"functionName" : "loadCustomerTouchpointList",
			"breadcrumb" : ["Customer Journey Map", "Touchpoint List"],
			"activeMenuItem" : "Customer_Journey_Map"
		},
		"Customer_Touchpoint_Report" : {
			"menuName" : "Touchpoint Report",
			"functionName" : "loadCustomerTouchpointReport",
			"breadcrumb" : ["Customer Journey Map", "Customer Touchpoint List" , "Customer Touchpoint Report" ],
			"activeMenuItem" : "Customer_Journey_Map"
		},
		"Customer_Touchpoint_Editor" : {
			"menuName" : "Touchpoint Report",
			"functionName" : "loadCustomerTouchpointEditor",
			"breadcrumb" : ["Customer Journey Map", "Customer Touchpoint List" , "Customer Touchpoint Editor" ],
			"activeMenuItem" : "Customer_Journey_Map"
		},
		
		// 2.4 Event Metrics for Media Channel and Touchpoint
		"Customer_Journey_Funnel" : {
			"menuName" : "Customer Journey Funnel",
			"functionName" : "loadDataEventFunnel",
			"breadcrumb" : ["Customer Journey Map", "Customer Journey Funnel"],
			"activeMenuItem" : "Customer_Journey_Funnel"
		},
		
		// 2.5 Data Observer for touchpoint and media channel
		"Leo_Event_Observer" : {
			"menuName" : "Leo Event Observer",
			"functionName" : "loadLeoObserverList",
			"breadcrumb" : ["Customer Journey Map", "Leo Event Observer"],
			"activeMenuItem" : "Leo_Event_Observer"
		},
		"Leo_Observer_Report" : {
			"menuName" : "Leo Observer Report",
			"functionName" : "loadDataObserverReport",
			"breadcrumb" : ["Customer Journey Map", "Leo Event Observer", "Leo Observer Report"],
			"activeMenuItem" : "Leo_Event_Observer"
		},
		"Leo_Observer_Configs" : {
			"menuName" : "Leo Observer Configs",
			"functionName" : "loadDataObserverConfigs",
			"breadcrumb" : ["Customer Journey Map", "Leo Event Observer", "Leo Observer Configs"],
			"activeMenuItem" : "Leo_Event_Observer"
		},
		
		// 2.6 Journey Map List, Report and Editor
		"Journey_Map_List" : {
			"menuName" : "Journey Map List",
			"functionName" : "loadJourneyMapList",
			"breadcrumb" : ["Customer Journey Map", "Journey Map List"],
			"activeMenuItem" : "Customer_Journey_Map"
		},
		"Journey_Map_Report" : {
			"menuName" : "Journey Map Report",
			"functionName" : "loadJourneyMapReport",
			"breadcrumb" : ["Customer Journey Map", "Journey Map List", "Journey Map Report"],
			"activeMenuItem" : "Customer_Journey_Map"
		},
		"Journey_Map_Studio" : {
			"menuName" : "Journey Map Studio",
			"functionName" : "loadJourneyMapStudio",
			"breadcrumb" : ["Customer Journey Map", "Journey Map List","Journey Map Studio"],
			"activeMenuItem" : "Customer_Journey_Map"
		},
		
		////////////////////////// 3) CUSTOMER DATA MODULE //////////////////////////
		
		// 3.1 Customer Profile 
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
		
		// 3.2 Customer Segmentation
		"Segmentation_List" : {
			"menuName" : "Segmentation List",
			"functionName" : "loadSegmentList",
			"breadcrumb" : ["Customer Data Hub", "Segmentation List"],
			"activeMenuItem" : "Segmentation_List"
		},
		"Segment_Builder" : {
			"menuName" : "Segment Builder",
			"functionName" : "loadSegmentBuilder",
			"breadcrumb" : ["Customer Data Hub", "Segmentation List", "Segment Builder"],
			"activeMenuItem" : "Segmentation_List"
		},
		"Segment_Details" : {
			"menuName" : "Segment Details",
			"functionName" : "loadSegmentDetails",
			"breadcrumb" : ["Customer Data Hub", "Segmentation List", "Segment Details"],
			"activeMenuItem" : "Segmentation_List"
		},
		"Segment_Activation" : {
			"menuName" : "Segment Activation",
			"functionName" : "loadSegmentActivation",
			"breadcrumb" : ["Customer Data Hub", "Segmentation List", "Segment Activation"],
			"activeMenuItem" : "Segmentation_List"
		},
		
		////////////////////////// 4) MARKETING DATA MODULE //////////////////////////
		
		
		// 4.1 Digital Marketing Asset Management
		"Digital_Asset_Categories" : {
			"menuName" : "Digital Asset Categories",
			"functionName" : "loadDigitalAssetCategories",
			"breadcrumb" : ["Marketing Data Hub", "Digital Asset Categories"],
			"activeMenuItem" : "Digital_Asset_Categories"
		},
		
		// 4.2 Content Marketing Pages
		"Pages_in_Category" : {
			"menuName" : "Media Pages",
			"functionName" : "loadPagesInCategory",
			"breadcrumb" : ["Marketing Data Hub", "Digital Marketing Assets", "Media Pages"],
			"activeMenuItem" : "Digital_Marketing_Assets"
		},
		
		// 4.3 Content Page Info with Posts
		"Page_Information" : {
			"menuName" : "Page Information",
			"functionName" : "loadPageInfo",
			"breadcrumb" : ["Marketing Data Hub", "Digital Marketing Assets", "Media Pages","Page Information"],
			"activeMenuItem" : "Digital_Marketing_Assets"
		},
		
		// 4.4 Content Post Info
		"Post_Information" : {
			"menuName" : "Post Information",
			"functionName" : "loadPostInfo",
			"breadcrumb" : ["Marketing Data Hub", "Digital Marketing Assets", "Media Pages","Page Information","Post Information"],
			"activeMenuItem" : "Digital_Marketing_Assets"
		},
		
		// 4.5 TODO Product and Service Catalog
		"Products_and_Services" : {
			"menuName" : "Products and Services",
			"functionName" : "loadProductsAndServices",
			"breadcrumb" : ["Marketing Data Hub", "Products & Services"],
			"activeMenuItem" : "Digital_Marketing_Assets"
		},
		"Product_Report" : {
			"menuName" : "Product Report",
			"functionName" : "loadProductReport",
			"breadcrumb" : ["Marketing Data Hub", "Products & Services", "Product Report"],
			"activeMenuItem" : "Digital_Marketing_Assets"
		},
		"Service_Report" : {
			"menuName" : "Service Report",
			"functionName" : "loadServiceReport",
			"breadcrumb" : ["Marketing Data Hub", "Products & Services", "Service Report"],
			"activeMenuItem" : "Digital_Marketing_Assets"
		},
		"Product_Data_Editor" : {
			"menuName" : "Product Data Editor",
			"functionName" : "loadProductDataEditor",
			"breadcrumb" : ["Marketing Data Hub", "Products & Services", "Product Data Editor"],
			"activeMenuItem" : "Digital_Marketing_Assets"
		},
		"Product_Data_Editor" : {
			"menuName" : "Service Data Editor",
			"functionName" : "loadServiceDataEditor",
			"breadcrumb" : ["Marketing Data Hub", "Products & Services", "Service Data Editor"],
			"activeMenuItem" : "Digital_Marketing_Assets"
		},
		
		"Campaign_Management" : {
			"menuName" : "Campaign Management",
			"functionName" : "loadCampaignManagement",
			"breadcrumb" : ["Marketing Data Hub", "Campaign Management"],
			"activeMenuItem" : "Campaign_Management"
		},
		
		// 4.6 Customer Personalization Models 
		"Personalization_Models" : {
			"menuName" : "Personalization Models",
			"functionName" : "loadPersonalizationModels",
			"breadcrumb" : ["Personalization AI Hub", "Personalization AI Models"],
			"activeMenuItem" : "Segmentation_List"
		},
		
		// 4.7 Affiliate Advertising Widgets
		"Affiliate_Ad_Widgets" : {
			"menuName" : "Affiliate Ad Widgets",
			"functionName" : "loadAffiliateAdWidgets",
			"breadcrumb" : ["Personalization AI Hub", "Affiliate Ad Widgets"],
			"activeMenuItem" : "Segmentation_List"
		},
		
		// 4.8 Email Marketing Campaigns
		"Email_Campaigns" : {
			"menuName" : "Email Campaign List",
			"functionName" : "loadEmailCampaigns",
			"breadcrumb" : ["Marketing Data Hub", "Email Campaigns"]
		},
		"Email_Campaign_Report" : {
			"menuName" : "Email Campaign Report",
			"functionName" : "loadEmailCampaignReport",
			"breadcrumb" : ["Marketing Data Hub", "Email Campaigns", "Email Campaign Report"]
		},
		"Email_Campaign_Editor" : {
			"menuName" : "Email Campaign Editor",
			"functionName" : "loadEmailCampaignEditor",
			"breadcrumb" : ["Marketing Data Hub", "Email Campaigns", "Email Campaign Editor"]
		},
		
		// 4.9 Push Message Marketing Campaigns
		"Push_Message_Campaigns" : {
			"menuName" : "Push Message Campaigns",
			"functionName" : "loadPushMessageCampaigns",
			"breadcrumb" : ["Marketing Data Hub", "Push Message Campaigns"]
		},
		"Push_Message_Campaign_Report" : {
			"menuName" : "Push Message Campaign Report",
			"functionName" : "loadPushMessageCampaignReport",
			"breadcrumb" : ["Marketing Data Hub", "Push Message Campaigns", "Campaign Report"]
		},
		"Push_Message_Campaign_Editor" : {
			"menuName" : "Push Message Campaign Editor",
			"functionName" : "loadPushMessageCampaignEditor",
			"breadcrumb" : ["Marketing Data Hub", "Push Message Campaigns", "Campaign Editor"]
		},
		
		////////////////////////// 5) SYSTEM DATA MODULE //////////////////////////
		
		// 5.1 User Login Management
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
		
		// 5.2 Customer Data API to manually track, Import/Export  tab-separated values (TSV) file 
		"Data_API_Management" : {
			"menuName" : "Data API Management",
			"functionName" : "loadDataApiManagement",
			"breadcrumb" : ["System Management", "Data API Management"],
			"activeMenuItem" : "Data_API_Management"
		},
	
		// 5.3 System Monitor and Configs 
		"System_Configuration" : {
			"menuName" : "System Configuration",
			"functionName" : "loadSystemInfoConfigs",
			"breadcrumb" : ["System Management", "System Configuration"],
			"activeMenuItem" : "System_Configuration"
		}
};
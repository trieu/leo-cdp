
// --- Business Hub ---

function loadSalesDashboard() {
    loadView('/view/hubs/business/sales-dashboard.html?admin=1', pageDomSelector, function () {
    	initSalesDashboard();
    });
}

function loadJourneyMapDesigner() {
    loadView('/view/hubs/business/journey-map-studio.html?admin=1', pageDomSelector, function () {
    	loadOkJourneyMapDesigner();
    });
}


// ------------ Report Analytics Controllers ---------------------



function loadContentReport() {
    loadView('/view/report/content-report.html?admin=1', pageDomSelector, function () {

    });
}

function loadLeadReport() {
    loadView('/view/report/lead-report.html?admin=1', pageDomSelector, function () {

    });
}

function loadUserReport() {
    loadView('/view/report/user-report.html?admin=1', pageDomSelector, function () {
        loadDataUserAnalytics();
    });
}
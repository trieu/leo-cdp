
// ------------ Report Analytics Controllers ---------------------

function loadSalesDashboard() {
    loadView('/view/report/sales-dashboard.html?admin=1', pageDomSelector, function () {
    	initSalesDashboard();
    });
}

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
exports.menus = {
    menuAd: {
        title: '',
        text: " Ad Management",
        icon: '<i class="fa fa-fw fa-list"></i>',
        menuChild: [
            {title: 'Ad Unit Management', text: ' Ad Units', icon: '<i class="fa fa-fw fa-list"></i>', link: '/creative/list', roles: ["*"] },
            {title: 'Ad Placement Management', text: ' Ad Placements', icon: '<i class="fa fa-fw fa-list"></i>', link: '/placement/list-all', roles: ["superadmin", "admin", "operator"] },
            {title: 'Campaign Management', text: ' Ad Campaign', icon: '<i class="fa fa-fw fa-list"></i>', link: '/campaign', roles: ["superadmin", "admin", "operator"] },
            {title: 'Flight Management', text: ' Ad Flight', icon: '<i class="fa fa-fw fa-list"></i>', link: '/flight', roles: ["superadmin", "admin", "operator"] },
            {title: 'Ad Live Event Management', text: ' Ad Live Events', icon: '<i class="fa fa-fw fa-list"></i>', link: '/event', roles: ["superadmin", "admin", "operator"] },
            {title: '', text: ' New Ad Unit', icon: '<i class="fa fa-fw fa-play"></i>', link: '/creative/new', roles: ["superadmin", "admin", "operator"] },
            {title: '', text: ' New PayTV Ad Unit', icon: '<i class="fa fa-fw fa-play"></i>', link: '/creative/new/video-paytv', roles: ["superadmin", "admin", "operator", "admin-paytv"] },
        ]
    },
    menuReport: {
        title: '',
        text: " Reports",
        icon: '<i class="fa fa-fw fa-list"></i>',
        menuChild: [
            {title: '', text: ' Summary Ad KPI', icon: '<i class="fa fa-fw fa-line-chart"></i>', link: '/creative/visualize/metrics', roles: ["superadmin", "admin", "operator"] },
            {title: '', text: ' PayTV Inventory', icon: '<i class="fa fa-fw fa-signal"></i>', link: '/monitor/inventory-paytv', roles: ["superadmin", "admin", "operator", "admin-paytv"] },
            {title: '', text: ' FptPlay Inventory', icon: '<i class="fa fa-fw fa-signal"></i>', link: '/monitor/inventory-report', roles: ["superadmin", "admin", "operator"] },
            // {title: '', text: ' Booking & Inventory', icon: '<i class="fa fa-fw fa-line-signal"></i>', link: '/monitor/inventory', roles: ["superadmin", "admin", "operator"] },
            // {title: '', text: ' Forecast Inventory', icon: '<i class="fa fa-fw fa-signal"></i>', link: '/monitor/inventory-predicted', roles: ["superadmin", "admin", "operator"] },
        ]
    },
    menuAnalytic: {
        title: '',
        text: " Analytics",
        icon: '<i class="fa fa-fw fa-line-chart"></i>',
        menuChild: [
            {title: '', text: ' Ad Metrics', icon: '<i class="fa fa-fw fa-line-chart"></i>', link: '/monitor', roles: ["superadmin", "admin", "operator", "sale"] },
            {title: '', text: ' Audience Report', icon: '<i class="fa fa-fw fa-bar-chart-o"></i>', link: '/monitor/user', roles: ["superadmin", "admin", "operator", "sale"] },
            // {title: '', text: ' Live Event EPL', icon: '<i class="fa fa-fw fa-file-excel-o"></i>', link: '/monitor/live-event', roles: ["superadmin", "admin", "operator"] },
            // {title: '', text: ' GeoLocation Analytics', icon: '<i class="fa fa-fw fa-map-marker"></i>', link: '/monitor/geolocation', roles: ["superadmin", "admin", "operator"] },
        ]
    },
}

exports.actions = {
    creative: {
        new: {
            roles: ["superadmin", "admin", "operator"]
        },
        edit: {
            roles: ["superadmin", "admin", "operator", "admin-paytv"]
        },
        delete: {
            roles: ["superadmin", "admin", "operator"]
        },
        copy: {
            roles: ["superadmin", "admin", "operator", "admin-paytv"]
        }
    },
    placement: {
        new: {
            roles: ["superadmin", "admin", "operator"]
        },
        edit: {
            roles: ["superadmin", "admin", "operator"]
        },
        delete: {
            roles: ["superadmin", "admin", "operator"]
        },
    },
    campaign: {
        new: {
            roles: ["superadmin", "admin", "operator"]
        },
        edit: {
            roles: ["superadmin", "admin", "operator"]
        },
        delete: {
            roles: ["superadmin", "admin", "operator"]
        },
    },
    flight: {
        new: {
            roles: ["superadmin", "admin", "operator"]
        },
        edit: {
            roles: ["superadmin", "admin", "operator"]
        },
        delete: {
            roles: ["superadmin", "admin", "operator"]
        },
    },
    event: {
        new: {
            roles: ["superadmin", "admin", "operator"]
        },
        edit: {
            roles: ["superadmin", "admin", "operator"]
        },
        delete: {
            roles: ["superadmin", "admin", "operator"]
        },
    },

}

exports.userGuest = {
    _id: -1,
    roles: {"user" : true},
    username: "guest",
    email: "guest@gmail.com"
}


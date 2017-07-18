
var display = require('../configs/display');

exports.getMenus = function(roles){
    var menus = display.menus;
    var temp = [];
    for(var i in menus){
        var menuChild = [];
        for(var j in menus[i].menuChild){
            var rolesArr = menus[i].menuChild[j].roles;
            for(var r in rolesArr){
                if(rolesArr[r] == '*' || roles[rolesArr[r]]){
                    menuChild.push(menus[i].menuChild[j])
                }
            }
        }
        temp.push({
            title: menus[i].title,
            text: menus[i].text,
            icon: menus[i].icon,
            menuChild: menuChild
        })
    }
    return temp;
}

exports.getActions = function(roles){
    var actions = display.actions;
    var temp = {};
    for(var i in actions){
            temp[i] = actions[i];
        for(var j in actions[i]){
            
            var rolesArr = actions[i][j].roles;
            console.log(roles, actions[i][j].roles)

            temp[i][j].show = false;
            for(var r in rolesArr){
                
                if(roles[rolesArr[r]]){
                    console.log(rolesArr[r])
                    temp[i][j].show = true;
                }
            }
        }
    }
    console.log(temp)
    return temp;
}

exports.getUserGuest = display.userGuest;
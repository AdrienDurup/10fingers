//RELINKER BETA 0.1
//Make it configurable
//make it work for multi doc
//import plural from './src/API/toolbox.jsx';
//POUR CHANGER LA RACINE

//@targetengine "parentRelinker"; //NEEDED FOR PALETTE WINDOW
main();

function main() {
    try {

        var doc = app.activeDocument;
        var selected = doc.selection[0];
        if (selected == undefined) {
            throw 'Please select a valid object to get link from.';
            return;
        };
        if (!selected.hasOwnProperty('itemLink')) {
            throw 'selected object is not valid for this action.\rSelected Object must have a link. Frames are not valid. Graphic inside a frame is valid.';
            return;
        };

        var targetFolder = Folder.selectDialog();

        var win = generateWin(selected.itemLink, targetFolder);
                 win.show();
        

        // var win = generateWin();
        // win.show();



    } catch (e) {
        alert('Parent Relinker error : ' + e)
    }

}

    function generateWin(myItemLink, targetFolder) {
    // alert('running');
    var w = new Window('palette');
    var panel1 = w.add('panel', undefined, 'Path to modify : select last root element to delete');
    var panel2 = w.add('panel', undefined, 'New root');
    var buttonLine = panel1.add('group');
    var pathLine = panel1.add('group');
    var tmpPath = myItemLink.linkResourceURI;
    var tmpPath2 = targetFolder.fsName;
    var oldPathStr = pathLine.add('edittext', undefined, tmpPath);
    oldPathStr.readonly = true;


    // oldPathStatic1.onDraw=function(){//MARCHE PAS
    // oldPathStatic1.graphics.font=ScriptUI.newFont("Helvetica", "Bold", 50);
    // oldPathStatic1.graphics.foreGround=oldPathStatic1.graphics.newBrush(ScriptUIGraphics.BrushType.SOLID_COLOR,[1,0,0]);
    // }

    var pathButtonHandler = {
        array: [],
        value: '',
        draw: function(index) {
            this.value = '';
            for (var i = 0; i <= index; i++) {
                var secondPart = '';
                if (i <= index) {
                    this.value += '\/' + this.array[i].value;
                } else {
                    //oldPathStatic2.text+='\/'+this.array[i].value;
                };

            };
            oldPathStr.text = this.value;
        }
    };

    generateButtons(buttonLine, tmpPath, pathButtonHandler);
    panel2.add('staticText', undefined, tmpPath2);
        var postLine=panel2.add('group');
    w.okButton = postLine.add('button', undefined, 'UPDATE');
    w.cancel=postLine.add('button', undefined, 'Cancel');
    w.cancel.onClick=function(){
        w.hide();
    }

    w.okButton.onClick = function() {
        var pathData = {
            oldRoot: oldPathStr.text,
            newRoot: tmpPath2,
        };
        w.hide();
        runRelink(pathData);
        // w.hide();
        //w.close(data);
        
    }
    return w;


}

function generateButtons(group, pathString, handler) {

    var pathArr = pathString.split('\/');
    pathArr.pop();

    for (var i = 0; i < pathArr.length; i++) {
        var el = group.add('button', undefined, pathArr[i]);
        el.index = i;
        el.value = pathArr[i];
        el.onClick = function() {
            handler.draw(this.index);
        };
        handler.array.push(el);
    };
}

function runRelink(dataObject) {//DEBUGGER LA COMBINAISON DES PATHS
        var doc = app.activeDocument;
        var links = doc.links;
    var parent = dataObject.oldRoot;
    var newParent = dataObject.newRoot;
    var erreurs = 0;
    var relinkedCount = 0;
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        if (link.status == LinkStatus.LINK_MISSING) {
            var currentLink = link.linkResourceURI;
                        var splitAtParent = currentLink.substring(parent.length);
            // var splitAtParent = currentLink.split(parent);
            var newLocation = newParent +'\/'+ splitAtParent;
            //alert(newLocation);
            var file = new File(newLocation);
            if (file.exists) {
                link.relink(file);
                relinkedCount++;
            } else {
                erreurs++;
            };

        };

    };

    var resultString = relinkedCount + ' link' + plural(relinkedCount) + ' repared.\r';
    if (erreurs > 0) {
        resultString += erreurs + ' missing link' + plural(erreurs) + ' couldn\'t be resolved.';
    }
    alert(resultString);
}

function plural(number) {
    if (typeof number == 'number') {
        if (number > 1) {
            return 's';
        } else {
            return '';
        };
    };
}


/* /Users/creation/Documents/DATA-PRODUITS/03000/03230/03230_2009_01.eps
/Volumes/Bibliotheque/FOTOLIA/Humains/serie petite fille blonde 1/Fotolia_53165497_Subscription_Monthly_XL.jpg */


//POUR LES PRODUITS : fonctionne parfaitement
/* var doc = app.activeDocument;
var links = doc.links;
var parent = 'DATA-PRODUITS';
var newParent = '\/Users\/creation\/Documents\/DATA-PRODUITS';
var erreurs=0;
for (var i = 0; i < links.length; i++) {
    var link = links[i];
    if (link.status == LinkStatus.LINK_MISSING) {
        var currentLink = link.linkResourceURI;
        var splitAtParent = currentLink.split(parent);
        var newLocation = newParent + splitAtParent[1];
        var file = new File(newLocation);
        //alert(newLocation);
        //link.relink(newLocation);
        if (file.exists) {
            link.relink(file);
        }else{
            erreurs++;
        };

    };
};
if(erreurs>0){
    var plural='';
    if(erreurs>1){plural='s';};
    alert(erreurs+' missing link'+plural+' could\'nt be resolved.')
} */
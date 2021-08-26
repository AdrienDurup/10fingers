//V 1.4
//@target indesign;
//@targetengine 'pageBisHandling';
//@include './src/API/logFolder.jsx';
//@include './src/API/toolbox.jsx';
var debug = {
    '1': true,
    '2': true,
    '3': true,
    '4': true,
    '5': true
};
var myDoc = app.activeDocument;
var myPages = myDoc.pages;
var myactivePage = myDoc.layoutWindows[0].activePage;
// alert(myactivePage.name);
//~ var pageAfterActive={};
//~ var pageBeforeActive={};
debugln(myactivePage.documentOffset, 1);
var myactivePageInPages;

//On désactive la numérotation automatique//
myDoc.sections[0].continueNumbering = false;
//----------------------------------------//

//myDoc.sections[0].pageNumberStart=parseInt(myDoc.sections[0].pageStart.name);//PAS UTILE APPAREMMENT (et tant mieux...)
//AJOUTER DES CONTROLES DE PRESENCE ET FAIRE LE SCRIPT DE UNDO

if (myPages[myactivePage.documentOffset] !== myPages[0]) {
    var pageBeforeActive = myPages[myactivePage.documentOffset - 1];
    debugln('Page avant : ' + pageBeforeActive.constructor.name, '1');
} else {
    debugln('Page avant : is not a page ', '1');
};

debugln('myPages Length : ' + myPages.length, 1);


if (isUnderBisSection(myactivePage)) {
    myPages.add(LocationOptions.AFTER, myactivePage); // On ajoute une page dans la même section, après la page active.
} else { //Si on n'est pas dans une section de page bis

    if (myPages[myactivePage.documentOffset] !== myPages[myPages.length - 1]) { //s'il y a une page après la page Active

        var pageAfterActive = myPages[myactivePage.documentOffset + 1];
        debugln(pageAfterActive.name, 1);
        var pageAfterActiveNum = parseInt(pageAfterActive.name);

        //ON VERIFIE D'ABORD SI LA PAGE ACTIVE N'EST PAS UNE PAGE BIS ET SI LA PAGE SUIVANTE EST UNE PAGE BIS : auquel cas : on rajoute une page
        if (isUnderBasicSection(myactivePage) && isUnderBisSection(pageAfterActive)) { //Si la page active n'est pas dans une section de page bis mais que la suivante est une page bis
            pageAfterActiveSection = pageAfterActive.appliedSection;
                        var newPage=myPages.add(LocationOptions.AFTER, myactivePage);
            // var newPage=myPages.add(LocationOptions.BEFORE, pageAfterActive);
            pageAfterActiveSection.pageStart = newPage;

        } else { // CREE LA SECTION SUR LA PAGE SUIVANTE

            var props = {
                'pageNumberStart': pageAfterActiveNum
            };
            var props2 = {
                'pageNumberStyle': PageNumberStyle.UPPER_LETTERS,
                'includeSectionPrefix': true,
                'continueNumbering': false
            };
            //AJOUTER UN CONTROLE ET UNE ALERTE DANNULATION SI IL Y A DEJA UNE SECTION
            try {

                myDoc.sections.add(pageAfterActive, props); // throw une erreur si on essaie d'ajouter une section à une page qui en a déjà (en l'occurence la suivante de la page active)
                //~ //Crée une nouvelle page, puis une nouvelle section (PAGE BIS)
                var newPage = myPages.add(LocationOptions.AFTER, myactivePage);
                pageAfterActive = myPages[myactivePage.documentOffset + 1];
                var newSec = myDoc.sections.add(pageAfterActive, props2);
                newSec.sectionPrefix = myactivePage.name + '-';

            } catch (error) {
                alert('Opération impossible sur cette page.')
            };
            debugln('Page après : ' + pageAfterActive.constructor.name, '1');
        };
    } else { //S'il n'y a pas de page après la page active. ATTENTION il n'y a pas de contrôle pour vérifier qu'il ne s'agit pas d'une page BIS : Si c'est le cas, le code suivant n'est pas censé s'exécuter : voir plus haut

        var lastPage = myPages.add(LocationOptions.AFTER, myactivePage);
        // alert(lastPage.name);
        var newSec = myDoc.sections.add(lastPage, props2);
        newSec.sectionPrefix = myactivePage.name + '-';
    };

    //On réactive la numérotation automatique//
    myDoc.sections[0].continueNumbering = true;
    //----------------------------------------//


};
try {
    var mySelec = myDoc.selection;
    var mySelecLen = mySelec.length;
} catch (error) {
    alert('Aucune sélection. ' + error);
};

function isUnderBisSection(aPage) { //Si prefixe de section commence par des chiffres et le style de num de la section = lettres majuscules : On est sur une page bis
    var rxGetNum = /^\d+/;
    var doesPrefixStartWithNum = rxGetNum.test(aPage.appliedSection.sectionPrefix);
    var currentPageNumStyle = aPage.appliedSection.pageNumberStyle;
    if (doesPrefixStartWithNum && currentPageNumStyle == PageNumberStyle.UPPER_LETTERS) {
        return true;
    } else {
        return false;
    };
}

function isUnderBasicSection(aPage) { //Si prefixe de section commence par des chiffres et le style de num de la section = lettres majuscules : On est sur une page bis
    var rxGetNum = /^\d+/;
    var doesPrefixStartWithNum = rxGetNum.test(aPage.appliedSection.sectionPrefix);
    var doesPageNameStartWithNum = rxGetNum.test(aPage.name);
    var currentPageNumStyle = aPage.appliedSection.pageNumberStyle;
    if (doesPageNameStartWithNum && !doesPrefixStartWithNum && currentPageNumStyle !== PageNumberStyle.UPPER_LETTERS) {
        return true;
    } else {
        return false;
    };
}
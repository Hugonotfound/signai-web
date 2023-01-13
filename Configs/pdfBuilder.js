const PDFDocument = require('pdfkit');
const fs = require('fs');

function getNumberBytypes(elements, type) {
    let number = 0;
    elements.forEach(element => {
        if (element.type == type)
            number = number + 1
    })
    return number;
}

//check file if exist
function checkFileExist(path) {
    try {
        fs.accessSync(path, fs.constants.F_OK);
        return true;
    } catch (err) {
        return false;
    }
}


function getTypes(elements) {
    let types = [];
    elements.forEach(element => {
        if (types.includes(element.type)) {
        } else {
            types.push(element.type)
        }
    })
    return types
}

async function buildPDF(dataCallback, endCallback, project) {
    let projectId = project._id.toString();


    const doc = new PDFDocument({ bufferPages: true, font: 'Helvetica', size: 'A4' });

    doc.on('data', dataCallback);
    doc.on('end', endCallback);

    //// PAGE DE GARDE 
    doc.image('pdf_background.jpg', 0, 0, { width: 611 })
    doc.image('logo_white_min.png', 250, 650, { fit: [100, 100], align: 'center' })
    doc
        .font("Helvetica-Bold")
        .fontSize(40)
        .fillColor('white')
        .text(
            'PROPOSITION DE SIGNALISATION', 55, 200, {
            width: 500,
            align: 'center'
        }
        );

    doc
        .font("Helvetica")
        .fontSize(20)
        .fillColor('white')
        .text(project.company, 55, 50, {
            width: 500,
            align: 'center'
        })

    doc
        .font("Helvetica")
        .fontSize(20)
        .fillColor('white')
        .text(project.name, 55, 300, {
            width: 500,
            align: 'center'
        })

    //////////////////////////////////////////////////////////////////////////////////////////////////////// Nouvelle page 
    doc.addPage({
        margins: {
            top: 0,
            bottom: 0,
            left: 72,
            right: 72
        }
    })
    doc.font("Helvetica").fontSize(10).fillColor('grey').text('SignAI - Proposition de signalisation', 55, 20, {
        width: 500,
        align: 'center'
    })

    doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(40)
        .text(
            'PRÉAMBULE', 55, 225, {
            width: 500,
            align: 'center'
        }
        );
    doc
        .font("Helvetica")
        .fontSize(14)
        .text(
            "Le présent document, édité par la société SignAI, a pour but d’aider et d’aiguiller « WarmUpDays » ainsi que tous les porteurs du projet dans la réalisation et la conception d’un aménagement urbain dans le but de fluidifier le trafic routier de la zone indiquer sur notre plateforme.\n\nCes propositions de signalisations sont proposées par une intelligence artificielle, supervisé par l’équipe de SignAI, en prenant en compte plusieurs paramètres comme la signalisation déjà existante, ou les données de circulation réelles."
            , 55
            , 300, {
            width: 500,
            align: 'justify'
        }
        );

    doc.font("Helvetica").fontSize(10).fillColor('grey').text(project.company + ' - ' + project.name, 30, 760, {
        width: 550,
        align: 'left'
    })
    doc.font("Helvetica").fontSize(10).fillColor('grey').text(doc.bufferedPageRange().count, 30, 760, {
        width: 550,
        align: 'right'
    })

    //////////////////////////////////////////////////////////////////////////////////////////////////////// Nouvelle page 

    doc.addPage({
        margins: {
            top: 0,
            bottom: 0,
            left: 72,
            right: 72
        }
    })
    doc.font("Helvetica").fontSize(10).fillColor('grey').text('SignAI - Proposition de signalisation', 55, 20, {
        width: 500,
        align: 'center'
    })

    doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(40)
        .text(
            'SOMMAIRE', 55, 120, {
            width: 500,
            align: 'center'
        }
        );
    doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .text(
            "Préambule ……………………………………………………………………… 2\n\n\n\nSommaire ………………………………………………………………………. 3\n\n\n\nDescription …………………………………………………………………….. 4\n\n\n\nÉtapes du projet ………………………………………………………………. 4\n\n\n\nDétails du projet ………………………………………………………………. 5\n\n\n\nRésultats après le passage de l’IA ………………………………………… 6\n\n\n\nAmélioration suites aux propositions de l’IA ……………………………. 7\n\n\n\nContact …………………………………………………………………………. 8"
            , 60
            , 200, {
            width: 500,
            align: 'center'
        }
        );

    doc.font("Helvetica").fontSize(10).fillColor('grey').text(project.company + ' - ' + project.name, 30, 760, {
        width: 550,
        align: 'left'
    })
    doc.font("Helvetica").fontSize(10).fillColor('grey').text(doc.bufferedPageRange().count, 30, 760, {
        width: 550,
        align: 'right'
    })

    //////////////////////////////////////////////////////////////////////////////////////////////////////// Nouvelle page 

    doc.addPage({
        margins: {
            top: 0,
            bottom: 0,
            left: 72,
            right: 72
        }
    })
    doc.font("Helvetica").fontSize(10).fillColor('grey').text('SignAI - Proposition de signalisation', 55, 20, {
        width: 500,
        align: 'center'
    })

    doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(20)
        .text(
            'Description', 55, 60, {
            width: 500,
            align: 'left'
        }
        );
    doc
        .font("Helvetica")
        .fillColor('black')
        .fontSize(14)
        .text(
            project.description, 55, 90, {
            width: 500,
            align: 'justify'
        }
        );
    doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(20)
        .text(
            'Étapes du projet', 55, 160, {
            width: 500,
            align: 'left'
        }
        );
    doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(14)
        .text(
            "1. Création", 100, 200, {
            width: 500,
            align: 'left'
        }
        );
    doc
        .font("Helvetica")
        .fillColor('black')
        .fontSize(14)
        .text(
            "Le projet est créé par notre équipe et validé par vos soins, cette étape permet de vérifier que SignAI dispose de toute les informations nécessaire afin de bien pouvoir diagnostiquer les causes des ralentissements/embouteillages, et ainsi vous montrer les meilleurs propositions d'optimisations d'emplacement des panneaux de signalisations que notre intélligence artificielle aura trouvé.",
            100, 220, {
            width: 450,
            align: 'justify'
        }
        );
    doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(14)
        .text(
            "2. Exécution", 100, 340, {
            width: 500,
            align: 'left'
        }
        );
    doc
        .font("Helvetica")
        .fillColor('black')
        .fontSize(14)
        .text(
            "Notre intelligence artificelle va chercher à comprendre les raisons des ralentissements et proposer des solutions afin de résoudre ses problèmes. Grâce à la carte que notre équipe lui aura fourni, et les données réeles des traffic routiers que l'on aura receulli sur une semaine, elle va verifier que la solution proposer fonctionne qu'elle que soit le traffic.",
            100, 360, {
            width: 450,
            align: 'justify'
        }
        );
    doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(14)
        .text(
            "3. Vérification", 100, 510, {
            width: 500,
            align: 'left'
        }
        );
    doc
        .font("Helvetica")
        .fillColor('black')
        .fontSize(14)
        .text(
            "Notre équipe d’expert SignAI, va vérifier les résultats fournis par notre intelligence artificielle afin de vous proposer les meilleurs propositions de signalisation.",
            100, 530, {
            width: 450,
            align: 'justify'
        }
        );
    doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(14)
        .text(
            "4. Terminé", 100, 620, {
            width: 500,
            align: 'left'
        }
        );
    doc
        .font("Helvetica")
        .fillColor('black')
        .fontSize(14)
        .text(
            "Vous retrouvez ce rapport ainsi que le carte interactive sur votre tableau de bord, et recevez un exemplaire par mail.",
            100, 640, {
            width: 450,
            align: 'justify'
        }
        );



    doc.font("Helvetica").fontSize(10).fillColor('grey').text(project.company + ' - ' + project.name, 30, 760, {
        width: 550,
        align: 'left'
    })
    doc.font("Helvetica").fontSize(10).fillColor('grey').text(doc.bufferedPageRange().count, 30, 760, {
        width: 550,
        align: 'right'
    })

    //////////////////////////////////////////////////////////////////////////////////////////////////////// Nouvelle page 

    doc.addPage({
        margins: {
            top: 0,
            bottom: 0,
            left: 72,
            right: 72
        }
    })
    doc.font("Helvetica").fontSize(10).fillColor('grey').text('SignAI - Proposition de signalisation', 55, 20, {
        width: 500,
        align: 'center'
    })

    doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(20)
        .text(
            'Détails du projet', 55, 60, {
            width: 500,
            align: 'left'
        }
        );
    doc
        .font("Helvetica")
        .fillColor('black')
        .fontSize(14)
        .text(
            'Adresse de départ : ' + project.departAddress + "\n                                 (" + project.longitude + ", " + project.latitude + ")", 55, 90, {
            width: 500,
            align: 'justify'
        }
        );
    doc
        .font("Helvetica")
        .fillColor('black')
        .fontSize(14)
        .text(
            'Rayon d\'action : ' + project.radius + " mètres", 55, 130, {
            width: 500,
            align: 'justify'
        }
        );
    doc
        .font("Helvetica")
        .fillColor('black')
        .fontSize(14)
        .text(
            'Contraintes: ' + (project.contraints.length == 0 ? 'Pas de contraintes indiqué' : ''), 55, 155, {
            width: 500,
            align: 'justify'
        }
        );

    if (project.contraints.length > 0) {
        let types = getTypes(project.contraints)

        types.forEach(type => {
            let number = getNumberBytypes(project.contraints, type).toString()
            let sentence = ""

            if (type == "sign")
                sentence = "Paneaux"
            if (type == "trafficlight")
                sentence = "Feu de Signalisation"
            if (type == "stop")
                sentence = "Panneau Stop"
            if (type == "yield")
                sentence = "Cédez le Passage"
            if (type == "roundabout")
                sentence = "Carrefour à sens giratoire"

            doc
                .font("Helvetica")
                .fillColor('black')
                .fontSize(14)
                .text(
                    number.toString() + " " + (sentence != "" ? sentence : type) + ': ', {
                    width: 410,
                    indent: 14,
                    lineGap: 7,
                    align: 'left'
                }
                );

            project.contraints.forEach(element => {
                if (element.type == type)
                    doc
                        .font("Helvetica")
                        .fillColor('purple')
                        .fontSize(12)
                        .text(
                            "- " + element.streetName, {
                            width: 410,
                            indent: 20,
                            lineGap: 7,
                            align: 'left'
                        }
                        );
            })
        });
    }
    if (checkFileExist(projectId + ".png"))
      doc.image(projectId + ".png", 50, 440, { fit: [500, 1000], align: 'center' })
    doc
        .font("Helvetica")
        .fillColor('black')
        .fontSize(10)
        .text(
            "La carte interactive est disponible sur : https://dashboard.signai.fr/view/" + projectId, 30, 700, {
            width: 500,
            indent: 20,
            lineGap: 7,
            align: 'left'
        }
        );





    doc.font("Helvetica").fontSize(10).fillColor('grey').text(project.company + ' - ' + project.name, 30, 760, {
        width: 550,
        align: 'left'
    })
    doc.font("Helvetica").fontSize(10).fillColor('grey').text(doc.bufferedPageRange().count, 30, 760, {
        width: 550,
        align: 'right'
    })

    //////////////////////////////////////////////////////////////////////////////////////////////////////// Nouvelle page 

    doc.addPage({
        margins: {
            top: 0,
            bottom: 0,
            left: 72,
            right: 72
        }
    })
    doc.font("Helvetica").fontSize(10).fillColor('grey').text('SignAI - Proposition de signalisation', 55, 20, {
        width: 500,
        align: 'center'
    })


    doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(20)
        .text(
            'Résultat après le passage de l\'IA', 55, 60, {
            width: 500,
            align: 'left'
        }
        );

    if (project.results.length > 0) {
        let types = getTypes(project.results)

        types.forEach(type => {
            let number = getNumberBytypes(project.results, type).toString()
            let sentence = ""

            if (type == "Panneaux")
                sentence = "Changement de Panneaux"
            if (type == "speed")
                sentence = "Modification de la vitesse"
            if (type == "traffic_light")
                sentence = "Cycles de feux de signalisation modifiés"
            if (type == "priority_up")
                sentence = "Augmentation de la priorité"
            if (type == "priority_down")
                sentence = "Priorité de la route baissé"

            doc
                .font("Helvetica")
                .fillColor('black')
                .fontSize(14)
                .text(
                    number.toString() + " " + (sentence != "" ? sentence : type) + ': ', {
                    width: 410,
                    indent: 14,
                    lineGap: 7,
                    align: 'left'
                }
                );

            project.results.forEach(element => {
                if (element.type == type) {
                    doc
                        .font("Helvetica")
                        .fillColor('purple')
                        .fontSize(12)
                        .text(
                            "- " + (element.type == "sign" ? (element.value) : '') + element.streetName + " (" + element.coordonateX + ", " + element.coordonateY + ")", {
                            width: 410,
                            indent: 20,
                            lineGap: 7,
                            align: 'left'
                        }
                        );

                    if (element.type == "traffic_light") {
                        let cyclesline = "";
                        element.value.split("'newTlCycle': [")[1].split("}]}, {").forEach((cycle) => {
                            cyclesline += "Cycle " + cycle.split("'")[3] + " : " + cycle.split("'")[7] + " secondes"
                            if (cycle.split("'")[3] == "3")
                                cyclesline += "\n"
                            else
                                cyclesline += " || "
                        })
                        doc
                        .font("Helvetica")
                        .fillColor('black')
                        .fontSize(12)
                        .text(
                            cyclesline, {
                            width: 410,
                            indent: 30,
                            lineGap: 7,
                            align: 'left'
                        }
                        );
                    }
                }
            })
        });
    }
    if (checkFileExist(projectId + "-results.png"))
      doc.image(projectId + "-results.png", 50, 440, { fit: [500, 1000], align: 'center' })
    doc
        .font("Helvetica")
        .fillColor('black')
        .fontSize(10)
        .text(
            "La carte interactive est disponible sur : https://dashboard.signai.fr/view/" + projectId, 30, 700, {
            width: 500,
            indent: 20,
            lineGap: 7,
            align: 'left'
        }
        );






        

    doc.font("Helvetica").fontSize(10).fillColor('grey').text(project.company + ' - ' + project.name, 30, 760, {
        width: 550,
        align: 'left'
    })
    doc.font("Helvetica").fontSize(10).fillColor('grey').text(doc.bufferedPageRange().count, 30, 760, {
        width: 550,
        align: 'right'
    })

    //////////////////////////////////////////////////////////////////////////////////////////////////////// Nouvelle page 

    doc.addPage({
        margins: {
            top: 0,
            bottom: 0,
            left: 72,
            right: 72
        }
    })
    doc.font("Helvetica").fontSize(10).fillColor('grey').text('SignAI - Proposition de signalisation', 55, 20, {
        width: 500,
        align: 'center'
    })


    doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(20)
        .text(
            'Amélioration suites aux propositions de l\'IA', 55, 60, {
            width: 500,
            align: 'left'
        }
        );

    doc.image("graph-one"+ ".png", 100, 100, { fit: [400, 1000], align: 'center' })

    doc.image("graph-two"+ ".png", 100, 420, { fit: [400, 1000], align: 'center' })




    doc.font("Helvetica").fontSize(10).fillColor('grey').text(project.company + ' - ' + project.name, 30, 760, {
        width: 550,
        align: 'left'
    })
    doc.font("Helvetica").fontSize(10).fillColor('grey').text(doc.bufferedPageRange().count, 30, 760, {
        width: 550,
        align: 'right'
    })

    //////////////////////////////////////////////////////////////////////////////////////////////////////// Nouvelle page 

    doc.addPage({
        margins: {
            top: 0,
            bottom: 0,
            left: 72,
            right: 72
        }
    })
    doc.font("Helvetica").fontSize(10).fillColor('grey').text('SignAI - Proposition de signalisation', 55, 20, {
        width: 500,
        align: 'center'
    })


    doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(20)
        .text(
            'Contact', 55, 60, {
            width: 500,
            align: 'left'
        }
        );

        doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(14)
        .text(
            'Votre Conseiller Signai ', 55, 90, {
            width: 500,
            align: 'justify'
        }
        );

        doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(14)
        .text(
            'Sitpi RAJENDRAN', 55, 120, {
            width: 500,
            indent: 20,
            align: 'justify'
        }
        );
        doc
        .font("Helvetica")
        .fillColor('blue')
        .fontSize(14)
        .text(
            'Email: sitpi@signai.fr', 55, 140, {
            width: 500,
            indent: 20,
            align: 'justify'
        }
        );

        doc
        .font("Helvetica")
        .fillColor('black')
        .fontSize(14)
        .text(
            'Téléphone: +33.6.66.66.66.66', 55, 160, {
            width: 500,
            indent: 20,
            align: 'justify'
        }
        );

    doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(14)
        .text(
            'Un problème avec votre conseiller, ou une autre demande ', 55, 190, {
            width: 500,
            align: 'justify'
        }
        );

        doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(14)
        .text(
            'L\'équipe Signai', 55, 210, {
            width: 500,
            indent: 20,
            align: 'justify'
        }
        );
        doc
        .font("Helvetica")
        .fillColor('blue')
        .fontSize(14)
        .text(
            'Email: support@signai.fr', 55, 230, {
            width: 500,
            indent: 20,
            align: 'justify'
        }
        );

        doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(14)
        .text(
            'Notre site internet', 55, 260, {
            width: 500,
            align: 'justify'
        }
        );

        doc
        .font("Helvetica")
        .fillColor('blue')
        .fontSize(14)
        .text(
            'https://www.signai.fr', 55, 280, {
            width: 500,
            indent: 20,
            align: 'justify'
        }
        );
        doc.font("Helvetica").fontSize(10).fillColor('grey').text(project.company + ' - ' + project.name, 30, 760, {
            width: 550,
            align: 'left'
        })
        doc.font("Helvetica").fontSize(10).fillColor('grey').text(doc.bufferedPageRange().count, 30, 760, {
            width: 550,
            align: 'right'
        })
    doc.end();

}

module.exports = { buildPDF };
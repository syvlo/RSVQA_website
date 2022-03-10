var images = imagesUSGS;
var questions = questionsUSGS;
var answers = answersUSGS;

var imageNumber = 0;
var tableStart = 0;
var dataset = -1;//0 = USGS, 1 = S2
var dataFolder = 'dataUSGS_reduced/';
function shiftImage(shift)
{
	imageNumber = imageNumber + shift;
	if (imageNumber < 0)
	{
		imageNumber = 0;
	}
	if (imageNumber >= Object.keys(images["images"]).length - 1)
	{
		imageNumber = Object.keys(images["images"]).length - 1;
	}
	while (!images["images"][imageNumber]['active'])
	{
		if (imageNumber >= Object.keys(images["images"]).length - 1)
			imageNumber = 0;
		if (imageNumber < 0)
			imageNumber = Object.keys(images["images"]).length - 1;
		imageNumber += shift;
	}
	updateImage(imageNumber);
}

function randomImage()
{
	imageNumber = Math.floor(Math.random() * Object.keys(images["images"]).length);
	while (!images["images"][imageNumber]['active'])
	{
		if (imageNumber >= Object.keys(images["images"]).length - 1)
			imageNumber = 0;
		imageNumber += 1;
	}
	updateImage(imageNumber);
}

function switchDataSet(new_dataset_number)
{
	if (dataset != new_dataset_number)
	{
		dataset = new_dataset_number;
		if (dataset == 0)
		{
			images = imagesUSGS;
			questions = questionsUSGS;
			answers = answersUSGS;
			dataFolder = 'dataUSGS_reduced//';
			document.getElementById('desc_dataset').innerHTML = "We have created a database using <a href=\"https://www.usgs.gov/centers/eros/science/usgs-eros-archive-aerial-photography-high-resolution-orthoimagery-hro?qt-science_center_objects=0#qt-science_center_objects\">USGS' high resolution (15.24cm) orthorectified images</a> and questions and answers derived from <a href=\"https://www.openstreetmap.org\">OSM</a>. You can explore a subset of 50 images from this dataset here.";
			document.getElementById('LRButton').classList.remove('w3-dark-grey');
			document.getElementById('VHRButton').classList.remove('w3-grey');
			document.getElementById('LRButton').classList.remove('selected-button');
			document.getElementById('VHRButton').classList.add('w3-dark-grey');
			document.getElementById('VHRButton').classList.add('selected-button');
			document.getElementById('LRButton').classList.add('w3-grey');
			document.getElementById('numberImages').innerHTML = 10659;
			document.getElementById('numberQuestions').innerHTML = 955664;
		}
		else
		{
			images = imagesS2;
			questions = questionsS2;
			answers = answersS2;
			dataFolder = 'data_S2_reduced/';
			document.getElementById('desc_dataset').innerHTML = "We have created a database using Sentinel-2 images and questions and answers derived from <a href=\"https://www.openstreetmap.org\">OSM</a>. You can explore a subset of 50 images from this dataset here.";
			document.getElementById('VHRButton').classList.remove('w3-dark-grey');
			document.getElementById('LRButton').classList.remove('w3-grey');
			document.getElementById('VHRButton').classList.remove('selected-button');
			document.getElementById('LRButton').classList.add('w3-dark-grey');
			document.getElementById('VHRButton').classList.add('w3-grey');
			document.getElementById('LRButton').classList.add('selected-button');
			document.getElementById('numberImages').innerHTML = 772;
			document.getElementById('numberQuestions').innerHTML = 77232;
		}
		randomImage();
	}
}

function updateImage(imageNumber)
{
	if (imageNumber >= 0 && imageNumber < Object.keys(images["images"]).length)
	{
		document.getElementById('VQAImage').src=dataFolder+imageNumber+'.png';
		document.getElementById('VQAImage').alt=imageNumber;
		document.getElementById('inputImageNumber').value=imageNumber;

		numQuestions = images['images'][imageNumber]['questions_ids'].length;
		tableStart = 0;
		updateTable();
	}
	else
		console.log('Image number ' + imageNumber + ' does not exist.');
}

function shiftTable(shift)
{
	tableStart = tableStart + shift * 10;
	if (tableStart < 0)
		tableStart = 0;
	if (tableStart >= numQuestions - 10)
		tableStart = numQuestions - 10;
	updateTable()
}

function updateTable()
{
	html = '<table class="w3-table-all w3-hoverable w3-small" style="table-layout: fixed; width: 100%"><tr><th style="width: 70%">Question</th><th style="width: 30%">Ground Truth</th></tr>';
	
	document.getElementById("totalQuestionPages").innerHTML = Math.floor(tableStart / 10) + 1 + " / " + Math.floor(numQuestions / 10);
	questionIds = images['images'][imageNumber]['questions_ids'];
	for (var i = tableStart; i < tableStart+10; ++i)
	{
		question = questions['questions'][questionIds[i]];
		if (question.active)
		{
			html += '<tr>';
			html += '<td>' + question.question + '</td>';
			html += '<td>' + answers['answers'][question.answers_ids[0]].answer + '</td>';
			html += '</tr>';
		}
	}
	html += '</table>';
	document.getElementById("questionsTable").innerHTML = html;
}

document.getElementById("inputImageNumber")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
    	imageNumber = parseInt(document.getElementById("inputImageNumber").value);
    	while (!images["images"][imageNumber]['active'])
		{
			imageNumber += 1;
		}
        updateImage(imageNumber);
    }
})


document.onkeydown = function(e) {
    e = e || window.event;
    switch(e.which || e.keyCode) {
    	case 37: // left
    	if (e.shiftKey)
    	{
    		shiftTable(-1);
    	}
    	else
    	{
    		shiftImage(-1);
    	}
    	e.preventDefault()
        break;

        case 38: // up
        break;

        case 39: // right
        if (e.shiftKey)
    	{
    		shiftTable(1);
    	}
    	else
    	{
    		shiftImage(1);
    	}
    	e.preventDefault()
        break;

        case 40: // down
        break;

        default: return; // exit this handler for other keys
    }
    //e.preventDefault(); // prevent the default action (scroll / move caret)
};
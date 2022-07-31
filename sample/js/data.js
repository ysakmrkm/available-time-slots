'use strict';

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
	origin: 'http://localhost:3000',
	credentials: true,
	optionsSuccessStatus: 200
}))

app.get('/json', (req, res) => {
	const template = [
		['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'],
		['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'],
		['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'],
		['12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '21:30', '22:00', '22:30'],
		['08:00', '08:30', '09:00', '09:30', '10:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '22:00', '22:30', '23:00', '23:30'],
		['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '17:30', '18:00', '18:30', '19:00', '21:30', '22:00', '22:30', '23:00', '23:30'],
		['08:00', '08:30', '09:00', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00']
	];

	const shuffle = ([...array]) => {
		for (let i = array.length - 1; i >= 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	const newArray = shuffle(template);

	const dataArray = [];

	for(var i = 0 ; i < 7; i++) {
    const startDate = req.query.start;
    const now = new Date(startDate);

		now.setDate(now.getDate() + i);

    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const date = ('0' + now.getDate()).slice(-2);

		dataArray[i] = {
      'date': year+'-'+month+'-'+date,
      'data': newTimes[i]
		}
	}

	const sampleData = {
		'data': dataArray
	};

		console.log(req.query.start);

    res.json(sampleData);
});

app.listen('3001', () => {
    console.log('Application started');
});
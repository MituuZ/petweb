# Petweb

A Python web application built with Flask and SQLite that allows users to track pet weights over time. The application can be easily modified to track any type of time-series data.

## Features

- Track multiple pets and their weights
- Support for different species with weight range validation
- Simple SQLite database for easy deployment
- Configurable database location

## Project Structure

```
petweb/
├── config/
│   ├── config.py        # Your configuration file (create from config_example.py)
│   └── config_example.py # Example configuration template
├── db/
│   └── setup_database.py # Database initialization and test data
└── petweb.db            # SQLite database (created on first run)
```

## Database Schema

The application uses the following database tables:

### weights
- `name` (TEXT): Pet name
- `weight` (REAL): Weight measurement
- `date` (DATE): Measurement date
- Unique constraint on (name, date)

### pets
- `name` (TEXT): Pet name
- `species` (TEXT): Type of pet
- `birth_day` (DATE): Pet's birth date
- `active` (BOOLEAN): Whether pet is active
- `color` (TEXT): Pet's color
- Unique constraints on name and (species, color)

### species
- `species` (TEXT): Species name
- `min` (REAL): Minimum healthy weight
- `max` (REAL): Maximum healthy weight

### configs
- `name` (TEXT): Configuration name
- `value` (TEXT): Configuration value
- Unique constraint on name

## License

This project is licensed under the [MIT License](LICENSE).

### Dependencies

- Flask: [BSD-3-Clause License](https://palletsprojects.com/p/flask/)
- SQLite: [Public Domain](https://www.sqlite.org/copyright.html)

# Flask

Flask is a lightweight WSGI web application framework. It is designed to make getting started quick and easy, with the ability to scale up to complex applications.

Website: https://palletsprojects.com/p/flask/
License: BSD-3-Clause
Copyright: 2010 by Pallets

BSD-3-Clause License:  
Copyright 2010 Pallets

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

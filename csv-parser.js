// CSV Parser for Elements Festival Schedule
class FestivalScheduleParser {
	constructor() {
		this.schedule = new Map();
		this.stages = new Set();
		this.days = new Set();
		this.stageOrder = []; // Track stage order as they appear in CSV
		this.showOrder = new Map(); // Track show order for each stage
	}

	// Parse CSV data
	parseCSV(csvText) {
		const lines = csvText.trim().split("\n");

		// Skip header row
		for (let i = 1; i < lines.length; i++) {
			const line = lines[i].trim();
			if (!line) continue; // Skip empty lines

			const values = this.parseCSVLine(line);

			if (values.length >= 4) {
				const day = values[0].trim();
				const time = values[1].trim();
				const stage = values[2].trim();
				const artist = values[3].trim();

				if (day && time && stage && artist) {
					this.addShow(day, time, stage, artist);
				}
			}
		}

		return this.getOriginalSchedule();
	}

	// Parse CSV line (handles commas within quotes and special characters)
	parseCSVLine(line) {
		const values = [];
		let current = "";
		let inQuotes = false;

		for (let i = 0; i < line.length; i++) {
			const char = line[i];

			if (char === '"') {
				inQuotes = !inQuotes;
			} else if (char === "," && !inQuotes) {
				values.push(current.trim());
				current = "";
			} else {
				current += char;
			}
		}

		values.push(current.trim());
		return values;
	}

	// Add a show to the schedule
	addShow(day, time, stage, artist) {
		this.days.add(day);
		this.stages.add(stage);

		// Track stage order (only add if not already added)
		if (!this.stageOrder.includes(stage)) {
			this.stageOrder.push(stage);
		}

		if (!this.schedule.has(day)) {
			this.schedule.set(day, new Map());
		}

		if (!this.schedule.get(day).has(stage)) {
			this.schedule.get(day).set(stage, []);
		}

		const show = {
			time: time,
			artist: artist,
			id: this.generateShowId(day, stage, artist, time),
		};

		this.schedule.get(day).get(stage).push(show);

		// Track show order for this stage
		const stageKey = `${day}-${stage}`;
		if (!this.showOrder.has(stageKey)) {
			this.showOrder.set(stageKey, []);
		}
		this.showOrder.get(stageKey).push(show.id);
	}

	// Generate a unique show ID
	generateShowId(day, stage, artist, time) {
		const dayNum = this.getDayNumber(day);
		const stageSlug = stage.toLowerCase().replace(/\s+/g, "-");
		const artistSlug = artist
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
			.replace(/\s+/g, "-") // Replace spaces with hyphens
			.replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
			.replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

		const timeSlug = time.replace(/[^a-z0-9]/gi, "");

		return `show_${dayNum}_${stageSlug}_${artistSlug}_${timeSlug}`;
	}

	// Get day number (1 = Friday, 2 = Saturday, 3 = Sunday)
	getDayNumber(day) {
		const dayMap = {
			Friday: 1,
			Saturday: 2,
			Sunday: 3,
		};
		return dayMap[day] || 1;
	}

	// Get sorted schedule
	getSchedule() {
		const sortedSchedule = new Map();

		// Sort days
		const sortedDays = Array.from(this.days).sort((a, b) => {
			return this.getDayNumber(a) - this.getDayNumber(b);
		});

		// Sort stages (Water, Air, Earth)
		const stageOrder = ["Water", "Air", "Earth"];
		const sortedStages = Array.from(this.stages).sort((a, b) => {
			return stageOrder.indexOf(a) - stageOrder.indexOf(b);
		});

		for (const day of sortedDays) {
			sortedSchedule.set(day, new Map());

			for (const stage of sortedStages) {
				if (this.schedule.has(day) && this.schedule.get(day).has(stage)) {
					// Sort shows by time
					const shows = this.schedule
						.get(day)
						.get(stage)
						.sort((a, b) => {
							return this.parseTime(a.time) - this.parseTime(b.time);
						});

					sortedSchedule.get(day).set(stage, shows);
				}
			}
		}

		return sortedSchedule;
	}

	// Get schedule in original order (no sorting)
	getOriginalSchedule() {
		const originalSchedule = new Map();

		// Sort days (keep this for consistent day order)
		const sortedDays = Array.from(this.days).sort((a, b) => {
			return this.getDayNumber(a) - this.getDayNumber(b);
		});

		for (const day of sortedDays) {
			originalSchedule.set(day, new Map());

			// Get stages in the order they appear in the CSV
			const stageOrder = this.getStageOrderForDay(day);
			
			for (const stage of stageOrder) {
				if (this.schedule.has(day) && this.schedule.get(day).has(stage)) {
					// Keep shows in original order (no sorting)
					const shows = this.schedule.get(day).get(stage);
					originalSchedule.get(day).set(stage, shows);
				}
			}
		}

		return originalSchedule;
	}

	// Get stage order for a specific day based on CSV order
	getStageOrderForDay(day) {
		// Use the tracked stage order from the CSV
		return this.stageOrder.filter(stage => 
			this.schedule.has(day) && this.schedule.get(day).has(stage)
		);
	}

	// Parse time string to minutes for sorting
	parseTime(timeStr) {
		const time = timeStr.toUpperCase();

		// Handle time ranges like "3:30PM-4:20PM" or "11:30PM-1:00AM"
		const rangeMatch = time.match(/(\d+):(\d+)(AM|PM)-(\d+):(\d+)(AM|PM)/);
		if (rangeMatch) {
			let startHours = parseInt(rangeMatch[1]);
			const startMinutes = parseInt(rangeMatch[2]);
			const startPeriod = rangeMatch[3];
			let endHours = parseInt(rangeMatch[4]);
			const endMinutes = parseInt(rangeMatch[5]);
			const endPeriod = rangeMatch[6];

			// Convert start time to 24-hour format
			if (startPeriod === "PM" && startHours !== 12) {
				startHours += 12;
			} else if (startPeriod === "AM" && startHours === 12) {
				startHours = 0;
			}

			// Convert end time to 24-hour format
			if (endPeriod === "PM" && endHours !== 12) {
				endHours += 12;
			} else if (endPeriod === "AM" && endHours === 12) {
				endHours = 0;
			}

			// Handle cases where end time is earlier (like 11:30PM - 1:00AM means next day)
			if (endHours < startHours) {
				endHours += 24; // Assume it's the next day
			}

			// Return start time for sorting
			return startHours * 60 + startMinutes;
		}

		// Handle single times like "3:00PM"
		const match = time.match(/(\d+):(\d+)(AM|PM)/);
		if (match) {
			let hours = parseInt(match[1]);
			const minutes = parseInt(match[2]);
			const period = match[3];

			if (period === "PM" && hours !== 12) {
				hours += 12;
			} else if (period === "AM" && hours === 12) {
				hours = 0;
			}

			return hours * 60 + minutes;
		}

		return 0;
	}

	// Parse time for sorting with late-night handling (treats 12am-6am as next day)
	parseTimeForSorting(timeStr, currentDay) {
		const time = timeStr.toUpperCase();

		// Handle time ranges like "3:30PM-4:20PM" or "11:30PM-1:00AM"
		const rangeMatch = time.match(/(\d+):(\d+)(AM|PM)-(\d+):(\d+)(AM|PM)/);
		if (rangeMatch) {
			let startHours = parseInt(rangeMatch[1]);
			const startMinutes = parseInt(rangeMatch[2]);
			const startPeriod = rangeMatch[3];

			// Convert start time to 24-hour format
			if (startPeriod === "PM" && startHours !== 12) {
				startHours += 12;
			} else if (startPeriod === "AM" && startHours === 12) {
				startHours = 0;
			}

			let timeInMinutes = startHours * 60 + startMinutes;

			// Handle late-night shows (12am-6am) - treat them as part of the next day for sorting
			if (startHours >= 0 && startHours < 6) {
				// This is a late-night show, adjust the day for sorting purposes
				const dayOrder = { Friday: 1, Saturday: 2, Sunday: 3 };
				const currentDayOrder = dayOrder[currentDay] || 0;

				if (currentDayOrder > 0 && currentDayOrder < 3) {
					// Move to the next day for sorting (but not beyond Sunday)
					const nextDayOrder = currentDayOrder + 1;
					const dayNames = ["Friday", "Saturday", "Sunday"];
					const adjustedDay = dayNames[nextDayOrder - 1] || currentDay;

					// Don't add 24 hours - just use the actual time but in the next day context
					// This means 12:30am Friday will be treated as 12:30am Saturday for sorting
				} else if (currentDayOrder === 3) {
					// Sunday late-night shows stay as Sunday but get higher time values
					timeInMinutes += 24 * 60;
				}
			}

			return timeInMinutes;
		}

		// Handle single times like "3:00PM"
		const match = time.match(/(\d+):(\d+)(AM|PM)/);
		if (match) {
			let hours = parseInt(match[1]);
			const minutes = parseInt(match[2]);
			const period = match[3];

			if (period === "PM" && hours !== 12) {
				hours += 12;
			} else if (period === "AM" && hours === 12) {
				hours = 0;
			}

			let timeInMinutes = hours * 60 + minutes;

			// Handle late-night shows (12am-6am) - treat them as part of the next day for sorting
			if (hours >= 0 && hours < 6) {
				// This is a late-night show, adjust the day for sorting purposes
				const dayOrder = { Friday: 1, Saturday: 2, Sunday: 3 };
				const currentDayOrder = dayOrder[currentDay] || 0;

				if (currentDayOrder > 0 && currentDayOrder < 3) {
					// Move to the next day for sorting (but not beyond Sunday)
					const nextDayOrder = currentDayOrder + 1;
					const dayNames = ["Friday", "Saturday", "Sunday"];
					const adjustedDay = dayNames[nextDayOrder - 1] || currentDay;

					// Don't add 24 hours - just use the actual time but in the next day context
					// This means 12:30am Friday will be treated as 12:30am Saturday for sorting
				} else if (currentDayOrder === 3) {
					// Sunday late-night shows stay as Sunday but get higher time values
					timeInMinutes += 24 * 60;
				}
			}

			return timeInMinutes;
		}

		return 0;
	}

	// Format time for display
	formatTimeForDisplay(timeStr) {
		const time = timeStr.toUpperCase();

		// Handle time ranges like "3:30PM-4:20PM"
		const rangeMatch = time.match(/(\d+):(\d+)(AM|PM)-(\d+):(\d+)(AM|PM)/);
		if (rangeMatch) {
			const startHours = parseInt(rangeMatch[1]);
			const startMinutes = parseInt(rangeMatch[2]);
			const startPeriod = rangeMatch[3];
			const endHours = parseInt(rangeMatch[4]);
			const endMinutes = parseInt(rangeMatch[5]);
			const endPeriod = rangeMatch[6];

			// Format start time
			const startTime = `${startHours}:${startMinutes
				.toString()
				.padStart(2, "0")}${startPeriod}`;

			// Format end time
			const endTime = `${endHours}:${endMinutes
				.toString()
				.padStart(2, "0")}${endPeriod}`;

			return `${startTime} - ${endTime}`;
		}

		// Return original time if no range
		return timeStr;
	}

	// Generate HTML for the festival schedule
	generateHTML() {
		const schedule = this.getOriginalSchedule();
		let html = "";

		for (const [day, stages] of schedule) {
			const dayNumber = this.getDayNumber(day);
			const dayTitle = `${day}`;

			html += `
                <div class="day-section">
                    <h2 class="day-title">${dayTitle}</h2>
                    <div class="stages-container">
            `;

			for (const [stage, shows] of stages) {
				html += `
                    <div class="stage" data-stage="${stage.toLowerCase()}" data-day="${dayNumber}">
                        <h3 class="stage-title">${stage} Stage</h3>
                        <div class="shows">
                `;

				for (const show of shows) {
					const formattedTime = this.formatTimeForDisplay(show.time);
					html += `
                        <div class="show" data-show="${show.id}" data-time="${
						show.time
					}">
                            <div class="show-header">
                                <span class="show-title">${this.escapeHtml(
																	show.artist
																)}</span>
                                <span class="show-time">${formattedTime}</span>
                            </div>
                            <div class="attendees"></div>
                        </div>
                    `;
				}

				html += `
                        </div>
                    </div>
                `;
			}

			html += `
                    </div>
                </div>
            `;
		}

		return html;
	}

	// Escape HTML to prevent XSS
	escapeHtml(text) {
		const div = document.createElement("div");
		div.textContent = text;
		return div.innerHTML;
	}
}

// Export for use in other scripts
window.FestivalScheduleParser = FestivalScheduleParser;

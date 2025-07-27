export const sampleAssessmentData = [
  {
    "question": "An electrician is repairing a frayed power cord for a household appliance. The repair requires two distinct materials: one to replace the inner metal strand that carries the electricity, and another to wrap the outside of the cord for safety. Which combination of materials is most effective for this task?",
    "options": [
      "An inner strand of copper and an outer wrap of rubber.",
      "An inner strand of rubber and an outer wrap of copper.",
      "An inner strand of aluminum and an outer wrap of steel.",
      "An inner strand of glass and an outer wrap of plastic."
    ],
    "correct_answer": "An inner strand of copper and an outer wrap of rubber.",
    "rationale": "The correct answer requires applying the concepts of conductors and insulators. Copper is an excellent electrical conductor (low resistance), allowing electric current to flow efficiently to the appliance. Rubber is an excellent electrical insulator (high resistance), which prevents the current from escaping the cord and causing electric shock. The other options are incorrect: using rubber inside would block the current; using two conductors (aluminum and steel) would create a safety hazard; and using two insulators (glass and plastic) would prevent the appliance from working at all."
  },
  {
    "question": "A student builds a simple circuit with a 6-volt battery and a light bulb, and wants to make the bulb dimmer without changing the battery. According to the principles of electric circuits, what change should the student make, and why?",
    "options": [
      "Increase the circuit's total resistance, which will decrease the current.",
      "Decrease the circuit's total resistance, which will decrease the current.",
      "Replace the connecting wires with a material that is a better conductor.",
      "Add a second 6-volt battery in parallel with the first one."
    ],
    "correct_answer": "Increase the circuit's total resistance, which will decrease the current.",
    "rationale": "This question requires analysis of Ohm's Law (Voltage = Current × Resistance). The brightness of the bulb is determined by the current flowing through it. To make the bulb dimmer, the current must be decreased. Since the voltage from the battery is constant (6 volts), the only way to decrease the current is to increase the total resistance of the circuit. Decreasing resistance or using a better conductor would increase the current, making the bulb brighter. Adding a second battery in parallel would not change the voltage in a simple circuit, and thus would not dim the bulb."
  },
  {
    "question": "In a lab, a circuit with a 12-volt power source and a resistor is found to have a current of 3 amps. The student replaces the resistor with a new one that is supposed to have double the resistance. After the replacement, the measured current is 2 amps. Which statement provides the most logical evaluation of this outcome?",
    "options": [
      "The new resistor's resistance was higher than the original, but not double.",
      "The power source's voltage must have dropped after the resistor was changed.",
      "The new resistor had a resistance exactly half that of the original resistor.",
      "The new resistor was actually a perfect insulator, stopping most of the current."
    ],
    "correct_answer": "The new resistor's resistance was higher than the original, but not double.",
    "rationale": "This question requires evaluating a situation using Ohm's Law (R = V/I). The original resistance was R = 12V / 3A = 4 ohms. Doubling this would give a new resistance of 8 ohms. The expected current with an 8-ohm resistor would be I = 12V / 8 ohms = 1.5 amps. However, the measured current was 2 amps. The actual resistance that would produce this current is R = 12V / 2A = 6 ohms. Therefore, the new resistor's resistance (6 ohms) was higher than the original (4 ohms) but less than the expected double value (8 ohms). The other options are incorrect based on these calculations."
  },
  {
    "question": "Explain in your own words how Ohm's Law relates voltage, current, and resistance in an electrical circuit. Provide a practical example.",
    "type": "text" as const,
    "rationale": "This open-ended question allows students to demonstrate their understanding of Ohm's Law (V = I × R) and its practical applications. A good answer should explain that voltage is the electrical pressure that drives current flow, current is the rate of electron flow, and resistance opposes this flow. A practical example might include explaining how adding more resistance (like a dimmer switch) reduces current flow and makes a light bulb dimmer."
  }
]; 
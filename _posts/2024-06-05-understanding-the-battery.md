---
title: "Understanding the Battery Module in OpenEnergy"
categories:
  - OpenEnergy
tags:
  - Battery Module
  - Python
  - Energy Storage
  - Simulation
  - Efficiency Adjustment
  - State of Health
  - Charging
  - Discharging
toc: true
---

Hello everyone! Today, we're going to dive into the `battery.py` module of our OpenEnergy project. This module is the heart of our energy storage system simulation, and it's where all the magic happens. You can find the complete code in our [GitHub repository](https://github.com/koulakhilesh/OpenEnergy/). This module is a great example of how to model a battery's behavior in Python.

## Overview

The `battery.py` module contains several classes that model different aspects of a battery's behavior:

- `BasicSOHCalculator`: Calculates the battery's State of Health (SOH) based on the energy cycled and depth of discharge (DOD).
- `TemperatureEfficiencyAdjuster`: Adjusts the battery's charging and discharging efficiencies based on temperature.
- `Battery`: Represents a battery with various properties and methods for charging and discharging.

Let's dive into each of these classes and understand how they work.

## BasicSOHCalculator

This class calculates the battery's State of Health (SOH) based on the energy cycled and depth of discharge (DOD). The `calculate_soh` method takes in the initial SOH, the amount of energy cycled, and the DOD, and calculates the new SOH based on a degradation rate.

```python
def calculate_soh(self, soh: float, energy_cycled_mwh: float, dod: float):
    """
    Calculates the State of Health (SOH) based on the given parameters.

    Args:
        soh (float): The initial State of Health.
        energy_cycled_mwh (float): The amount of energy cycled in megawatt-hours.
        dod (float): The depth of discharge as a fraction (0 to 1).

    Returns:
        float: The updated State of Health (SOH) after degradation.

    """
    base_degradation = 0.000005
    dod_factor = 2 if dod > 0.5 else 1
    degradation_rate = base_degradation * energy_cycled_mwh * dod_factor
    return soh * (1 - degradation_rate)
```

In the accompanying graph, observe the progression of State of Charge (SOC) and State of Health (SOH) values over time, illustrating the dynamic behavior of the battery system.
![SOC and SOH](https://raw.githubusercontent.com/koulakhilesh/OpenEnergy/master/images/notebook/assets/battery_simulation.png) 


## TemperatureEfficiencyAdjuster

This class adjusts the battery's charging and discharging efficiencies based on the temperature. The `adjust_efficiency` method takes in the current temperature and the current efficiencies, and adjusts them based on a simple rule: for every degree Celsius the temperature is away from 25°C, the efficiencies decrease by 1%.

```python
def adjust_efficiency(
    self,
    temperature_c: float,
    charge_efficiency: float,
    discharge_efficiency: float,
):
    """
    Adjusts the charge and discharge efficiency of the battery based on the temperature.

    Args:
        temperature_c (float): The temperature in degrees Celsius.
        charge_efficiency (float): The current charge efficiency of the battery.
        discharge_efficiency (float): The current discharge efficiency of the battery.

    Returns:
        Tuple[float, float]: A tuple containing the adjusted charge efficiency and discharge efficiency.
    """
    temp_effect = abs(temperature_c - 25) * 0.01
    new_charge_efficiency = max(0.5, min(charge_efficiency - temp_effect, 1.0))
    new_discharge_efficiency = max(
        0.5, min(discharge_efficiency - temp_effect, 1.0)
    )
    return new_charge_efficiency, new_discharge_efficiency
```
In the accompanying graph, observe the progression of State of Charge (SOC) and State of Health (SOH) values over time for each temperature, illustrating the dynamic behavior of the battery system.
![SOC and SOH](https://raw.githubusercontent.com/koulakhilesh/OpenEnergy/master/images/notebook/assets/battery_simulation_temperature.png) 

## Battery

This is the main class that represents a battery. It has various properties like capacity, efficiency, state of charge (SOC), state of health (SOH), and temperature. It also has methods for charging and discharging the battery, which adjust the efficiencies and update the SOH and cycle count.

The `charge` and `discharge` methods first adjust the efficiencies based on the temperature, then calculate the actual energy that can be charged or discharged, and finally update the SOC. They also call the `update_soh_and_cycles` method to update the SOH and cycle count.

```python
def charge(self, energy_mwh: float):
    """
    Charges the battery with the specified amount of energy.

    Args:
        energy_mwh (float): The amount of energy to be charged in megawatt-hours.
    """
    self.adjust_efficiency_for_temperature()
    energy_mwh = min(energy_mwh, self.max_charge_rate_mw * self.duration_hours)
    actual_energy_mwh = energy_mwh * self.charge_efficiency
    self.soc = min(self.soc + actual_energy_mwh / self.capacity_mwh, 1.0)
    self.update_soh_and_cycles(energy_mwh)
```

The `update_soh_and_cycles` method updates the SOH using the `BasicSOHCalculator` and updates the cycle count based on the energy cycled.

```python
def update_soh_and_cycles(self, energy_mwh: float):
    """
    Updates the state of health (SOH) and cycle count of the battery based on the energy cycled.

    Args:
        energy_mwh (float): The amount of energy cycled in megawatt-hours.
    """    
    self.energy_cycled_mwh += energy_mwh
    dod = 1.0 - self.soc
    self.soh = self.soh_calculator.calculate_soh(self.soh, energy_mwh, dod)
    self.check_and_update_cycles()
```

To explore the battery module in action, check out the Jupyter notebook [here](https://github.com/koulakhilesh/OpenEnergy/blob/master/notebooks/assets/battery.ipynb), where its functionality is demonstrated.




## Wrapping Up

That's a brief overview of the `battery.py` module in our OpenEnergy project. We've covered how the module models a battery's behavior, including how it adjusts efficiency based on temperature, calculates the state of health, and handles charging and discharging operations. I hope this gives you a better understanding of how we're simulating energy storage systems in our project. Stay tuned for more deep dives into other parts of the codebase!

As always, if you have any questions or suggestions, feel free to leave a comment below or open an issue on our [GitHub repository](https://github.com/koulakhilesh/OpenEnergy/). Happy coding!
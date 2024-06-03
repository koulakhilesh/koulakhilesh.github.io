---
title: "Understanding the Price Generation in OpenEnergy"
categories:
  - OpenEnergy
tags:
- Price Generation
- Python
- Pricing Models
- Simulated Price
- Average Price
- Forecasted Price
- Machine Learning

---


Hello everyone! In this post, we'll dive into the price generation in the OpenEnergy project. We'll be focusing on the `prices` folder under the `scripts` directory. You can find the code [here](https://github.com/koulakhilesh/OpenEnergy/).


## Overview

This module combines the functionality of various pricing strategies including simulated price, average price, and forecasted price. It provides a unified interface for interacting with different pricing models.

## Interface

The interface serves as a contract for all pricing models. It defines the methods that all pricing models should implement. This ensures that regardless of the pricing model used, the interaction remains consistent.

The `interfaces.py` file contains five interfaces: `IPriceData`, `IPriceEnvelopeGenerator`, `IPriceNoiseAdder`, and `IPriceDataHelper`. Each interface defines a set of methods that classes implementing the interface must provide.

### IPriceData

The `IPriceData` interface is used for classes that retrieve price data. It defines a single method, `get_prices`, which takes a date as input and returns a tuple containing two lists of floats representing the buy and sell prices for that date.

```python
class IPriceData(ABC):
    @abstractmethod
    def get_prices(self, date: datetime.date) -> t.Tuple[t.List[float], t.List[float]]:
        pass
```

### IPriceEnvelopeGenerator

The `IPriceEnvelopeGenerator` interface is used for classes that generate price envelopes. It defines a single method, `generate`, which takes a date as input and returns a list of price envelopes for that date.

```python
class IPriceEnvelopeGenerator(ABC):
    @abstractmethod
    def generate(self, date: datetime.date) -> t.List[float]:
        pass
```

### IPriceNoiseAdder

The `IPriceNoiseAdder` interface is used for classes that add noise to a list of prices. It defines a single method, `add`, which takes a list of prices as input and returns a new list of prices with added noise.

```python
class IPriceNoiseAdder(ABC):
    @abstractmethod
    def add(self, prices: t.List[float]) -> t.List[float]:
        pass
```

### IPriceDataHelper

The `IPriceDataHelper` interface is used for classes that provide helper methods for working with price data. It defines several methods for getting the current date and time, getting the date and time of the week prior to a given date, getting the data for the last week, getting the data for the current date, and getting the prices for the current date.

```python
class IPriceDataHelper(ABC):
    @abstractmethod
    def get_current_date(self, date: datetime.date) -> datetime.datetime:
        pass

    @abstractmethod
    def get_week_prior(
        self, current_date: datetime.datetime, delta_days: int
    ) -> datetime.datetime:
        pass

    @abstractmethod
    def get_last_week_data(
        self,
        current_date: datetime.datetime,
        week_prior: datetime.datetime,
        data: pd.DataFrame,
    ) -> pd.DataFrame:
        pass

    @abstractmethod
    def get_current_date_data(
        self, current_date: datetime.datetime, data: pd.DataFrame
    ) -> pd.DataFrame:
        pass

    @abstractmethod
    def get_prices_current_date(
        self, current_date_data: pd.DataFrame, column_name: str
    ) -> t.List[float]:
        pass
```


## Simulated Price

The simulated price model uses statistical methods to generate a price that simulates market conditions. It's useful for testing how systems would react to different market conditions.


The file we'll look at is `simulated_price.py`. This file contains the logic for generating simulated price data. It's a crucial part of the project as it allows us to create realistic, yet artificial, price data for testing and development purposes.

### SimulatedPriceEnvelopeGenerator

The `SimulatedPriceEnvelopeGenerator` class is responsible for generating a simulated price envelope based on a sine wave. The envelope is defined by a number of intervals, a minimum and maximum price, and a peak start and end index. 

The `generate` method is where the magic happens. It generates a list of price values for a given date. The prices are calculated based on the position of the interval in relation to the peak start and end. If the interval is within the peak, the price is calculated using a sine wave function. If it's outside the peak, the price is calculated using a smaller amplitude sine wave. A random adjustment is also added to each price to simulate real-world price fluctuations.

```python
class SimulatedPriceEnvelopeGenerator(IPriceEnvelopeGenerator):
    def generate(self, date: datetime.date) -> t.List[float]:
        # ... code omitted for brevity ...
        for i in range(self.num_intervals):
            # ... code omitted for brevity ...
            prices.append(price)
        return prices
```

### SimulatedPriceNoiseAdder

The `SimulatedPriceNoiseAdder` class adds simulated noise to the list of prices generated by the `SimulatedPriceEnvelopeGenerator`. This is done to make the simulated prices more realistic. The noise is added by randomly adjusting each price within a specified noise level. There's also a chance for a price spike to occur, which multiplies the price by a specified spike multiplier.

```python
class SimulatedPriceNoiseAdder(IPriceNoiseAdder):
    def add(self, prices: t.List[float]) -> t.List[float]:
        # ... code omitted for brevity ...
        for price in prices:
            # ... code omitted for brevity ...
            noisy_prices.append(new_price)
        return noisy_prices
```

### SimulatedPriceModel

The `SimulatedPriceModel` class brings it all together. It uses an instance of `SimulatedPriceEnvelopeGenerator` to generate a list of prices for a given date, and then adds noise to these prices using an instance of `SimulatedPriceNoiseAdder`. The result is a tuple containing two lists of prices: one with the original prices and one with the noisy prices.

```python
class SimulatedPriceModel(IPriceData):
    def get_prices(self, date: datetime.date) -> t.Tuple[t.List[float], t.List[float]]:
        # ... code omitted for brevity ...
        prices_with_noise_and_spikes = self.noise_adder.add(prices)
        return prices, prices_with_noise_and_spikes
```




## Average Price

The average price model calculates the average price based on historical data. It's a simple yet effective model for predicting future prices when the market conditions are stable.


The `average_price.py` file contains the `HistoricalAveragePriceModel` class, which calculates historical average prices. This class is a key component of the project as it provides the historical context needed to understand current price data.

### HistoricalAveragePriceModel

The `HistoricalAveragePriceModel` class is initialized with a data provider and an optional boolean indicating whether to interpolate missing values in the data. The data provider is used to retrieve price data, and the interpolation option determines whether missing values in the data are filled in using linear interpolation.

```python
class HistoricalAveragePriceModel(IPriceData):
    def __init__(self, data_provider: IDataProvider, interpolate: bool = True):
        # ... code omitted for brevity ...
        if self.interpolate:
            self.data[self.PRICE_COLUMN].interpolate(method="linear", inplace=True)
```

### get_prices

The `get_prices` method is the main method of the class. It takes a date as input and returns a tuple containing the average prices for the last week and the prices for the current date. The method uses helper methods to get the current date, the date a week prior, the data for the last week, the average prices for the last week, the data for the current date, and the prices for the current date.

```python
def get_prices(self, date: datetime.date) -> t.Tuple[t.List[float], t.List[float]]:
    # ... code omitted for brevity ...
    return average_prices_last_week, prices_current_date
```

### get_average_prices_last_week

The `get_average_prices_last_week` method calculates the average prices for the last week. It takes a DataFrame containing the price data for the last week as input and returns a list of average prices for each hour of the day. The method groups the data by hour and calculates the mean price for each group.

```python
def get_average_prices_last_week(
    self, last_week_data: pd.DataFrame
) -> t.List[float]:
    # ... code omitted for brevity ...
    return (
        last_week_data.groupby(last_week_data.index.hour)[self.PRICE_COLUMN]
        .mean()
        .tolist()
    )
```

## Forecasted Price

The forecasted price model uses advanced statistical methods or machine learning algorithms to predict future prices. It's the most complex model and can adapt to changing market conditions.


The `forecasted_price.py` file contains the `ForecastPriceModel` class, which implements the `IPriceData` and `IForecaster` interfaces. This class provides methods for training, forecasting, and evaluating prices.

### ForecastPriceModel

The `ForecastPriceModel` class is initialized with a data provider, a feature engineer, a machine learning model, a history length, a forecast length, and an optional boolean indicating whether to interpolate missing values in the data. The data provider is used to retrieve price data, the feature engineer is used to perform feature engineering on the data, and the machine learning model is used for forecasting.

```python
class ForecastPriceModel(IPriceData, IForecaster):
    def __init__(
        self,
        data_provider: IDataProvider,
        feature_engineer: IFeatureEngineer,
        model: IModel,
        history_length=7 * 24,
        forecast_length=24,
        interpolate: bool = True,
    ):
        # ... code omitted for brevity ...
```

### get_prices

The `get_prices` method is the main method of the class. It takes a date as input and returns a tuple containing the forecasted prices and the actual prices for the given date. The method uses helper methods to get the current date, the date a week prior, the data for the last week, the forecasted prices for the current date, the data for the current date, and the prices for the current date.

```python
def get_prices(self, date: datetime.date) -> t.Tuple[t.List[float], t.List[float]]:
    # ... code omitted for brevity ...
    return forecasted_prices, prices_current_date
```

### train, forecast, evaluate, save_model, load_model

The `train`, `forecast`, `evaluate`, `save_model`, and `load_model` methods are used to train the machine learning model, forecast prices, evaluate the forecasted prices, save the trained model to a file, and load a trained model from a file, respectively.

```python
def train(self, df):
    # ... code omitted for brevity ...

def forecast(self, df):
    # ... code omitted for brevity ...

def evaluate(self, y_true, y_pred):
    # ... code omitted for brevity ...

def save_model(self, file_path):
    # ... code omitted for brevity ...

@staticmethod
def load_model(file_path) -> IModel:
    # ... code omitted for brevity ...
```


To use any of the pricing models, you need to create an instance of the model and call the appropriate methods as defined in the interface. The specific implementation details depend on the programming language and the design of your software.

Please note that this is a high-level overview. For detailed information, refer to the specific documentation for each pricing model and the source code.

Remember, the best way to learn is by doing. So, I encourage you to clone the [repository](https://github.com/koulakhilesh/OpenEnergy/), play around with the code, and see what you can create. Happy coding!
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
toc: true
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
    """Interface for retrieving price data."""

    @abstractmethod
    def get_prices(self, date: datetime.date) -> t.Tuple[t.List[float], t.List[float]]:
        """Get the prices for a specific date.

        Args:
            date (datetime.date): The date for which to retrieve the prices.

        Returns:
            Tuple[List[float], List[float]]: A tuple containing two lists of floats.
                The first list represents the buy prices, and the second list represents
                the sell prices.
        """
        pass
```

### IPriceEnvelopeGenerator

The `IPriceEnvelopeGenerator` interface is used for classes that generate price envelopes. It defines a single method, `generate`, which takes a date as input and returns a list of price envelopes for that date.

```python
class IPriceEnvelopeGenerator(ABC):
    """
    Interface for generating price envelopes.
    """

    @abstractmethod
    def generate(self, date: datetime.date) -> t.List[float]:
        """
        Generate price envelopes for the given date.

        Args:
            date (datetime.date): The date for which to generate price envelopes.

        Returns:
            List[float]: A list of price envelopes.
        """
        pass
```

### IPriceNoiseAdder

The `IPriceNoiseAdder` interface is used for classes that add noise to a list of prices. It defines a single method, `add`, which takes a list of prices as input and returns a new list of prices with added noise.

```python
class IPriceNoiseAdder(ABC):
    """
    Interface for adding noise to a list of prices.
    """

    @abstractmethod
    def add(self, prices: t.List[float]) -> t.List[float]:
        """
        Adds noise to the given list of prices.

        Args:
            prices (List[float]): The list of prices to add noise to.

        Returns:
            List[float]: The list of prices with added noise.
        """
        pass
```

### IPriceDataHelper

The [`IPriceDataHelper`] interface is designed for classes that assist in handling price data, offering a suite of methods for date and price data manipulation. This interface facilitates obtaining the current date and time, calculating the date and time a week prior to a specified date, retrieving data for the preceding week, fetching data for the current date, and extracting prices for the current date.

```python
class IPriceDataHelper(ABC):
    @abstractmethod
    def get_current_date(self, date: datetime.date) -> datetime.datetime:
        """Retrieve the current date and time based on a given date.

        Args:
            date (datetime.date): The date to convert to datetime.

        Returns:
            datetime.datetime: The current date and time.
        """
        pass

    @abstractmethod
    def get_prior_date(
        self, current_date: datetime.datetime, delta_days: int
    ) -> datetime.datetime:
        """Calculate the date prior to the current date by a specified number of days.

        Args:
            current_date (datetime.datetime): The current date from which to calculate the prior date.
            delta_days (int): The number of days before the current date to calculate.

        Returns:
            datetime.datetime: The calculated prior date.
        """
        pass

    @abstractmethod
    def get_prior_data(
        self,
        current_date: datetime.datetime,
        prior_date: datetime.datetime,
        data: pd.DataFrame,
    ) -> pd.DataFrame:
        """Retrieve data for a period between the prior date and the current date from a given dataset.

        Args:
            current_date (datetime.datetime): The end date of the period for which to retrieve data.
            prior_date (datetime.datetime): The start date of the period for which to retrieve data.
            data (pd.DataFrame): The dataset from which to retrieve the data.

        Returns:
            pd.DataFrame: The filtered dataset containing data between the prior and current dates.
        """
        pass

    @abstractmethod
    def get_current_date_data(
        self, current_date: datetime.datetime, data: pd.DataFrame
    ) -> pd.DataFrame:
        """Retrieve data for the current date from a given dataset.

        Args:
            current_date (datetime.datetime): The date for which to retrieve data.
            data (pd.DataFrame): The dataset from which to retrieve the data.

        Returns:
            pd.DataFrame: The filtered dataset containing data for the current date.
        """
        pass

    @abstractmethod
    def get_prices_current_date(
        self, current_date_data: pd.DataFrame, column_name: str
    ) -> t.List[float]:
        """Extract price data for the current date from a given dataset.

        Args:
            current_date_data (pd.DataFrame): The dataset containing data for the current date.
            column_name (str): The name of the column from which to extract the prices.

        Returns:
            List[float]: The list of prices for the current date.
        """
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
        """
        Generates a simulated price envelope for the given date.

        Args:
            date (datetime.date): The date for which to generate the price envelope.

        Returns:
            List[float]: A list of price values representing the price envelope.
        """
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
        """
        Adds simulated noise to a list of prices.

        Args:
            prices (List[float]): The list of prices to add noise to.

        Returns:
            List[float]: The list of prices with simulated noise added.
        """
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
        """
        Generates simulated prices for the given date.

        Args:
            date (datetime.date): The date for which prices need to be generated.

        Returns:
            Tuple[List[float], List[float]]: A tuple containing two lists of prices.
            The first list represents the prices without noise and spikes,
            and the second list represents the prices with noise and spikes.

        """
        # ... code omitted for brevity ...
        prices_with_noise_and_spikes = self.noise_adder.add(prices)
        return prices, prices_with_noise_and_spikes
```

Below is the graph depicting the outcomes from the SimulatedPriceModel, showcasing the simulated prices:
![Simulated Prices](https://raw.githubusercontent.com/koulakhilesh/OpenEnergy/master/images/notebook/prices/simulated_prices.png) 

To explore the more on SimulatedPriceModel , check out the Jupyter notebook [here](https://github.com/koulakhilesh/OpenEnergy/blob/master/notebooks/prices/simulated_price.ipynb), where its functionality is demonstrated.

## Average Price

The average price model calculates the average price based on historical data. It's a simple yet effective model for predicting future prices when the market conditions are stable.


The `average_price.py` file contains the `HistoricalAveragePriceModel` class, which calculates historical average prices. This class is a key component of the project as it provides the historical context needed to understand current price data.

### HistoricalAveragePriceModel

The `HistoricalAveragePriceModel` class is initialized with a data provider and an optional boolean indicating whether to interpolate missing values in the data. The data provider is used to retrieve price data, and the interpolation option determines whether missing values in the data are filled in using linear interpolation.

```python
class HistoricalAveragePriceModel(IPriceData):
    def __init__(self, data_provider: IDataProvider, interpolate: bool = True, prior_days: int = DAYS_IN_WEEK):
        # ... code omitted for brevity ...
        if self.interpolate:
            self.data[self.PRICE_COLUMN].interpolate(method="linear", inplace=True)
```

### get_prices

The `get_prices` method is the main method of the class. It takes a date as input and returns a tuple containing the average prices for the last week and the prices for the current date. The method uses helper methods to get the current date, the date a week prior, the data for the last week, the average prices for the last week, the data for the current date, and the prices for the current date.

```python
def get_prices(self, date: datetime.date) -> t.Tuple[t.List[float], t.List[float]]:
    """
    Get the average prices for the last week and the prices for the current date.

    Args:
        date (datetime.date): The current date.

    Returns:
        Tuple[List[float], List[float]]: A tuple containing the average prices for the last week
        and the prices for the current date.
    """
    # ... code omitted for brevity ...
    return average_prices_last_week, prices_current_date
```

### get_average_prices_last_week

The `get_average_prices_last_week` method calculates the average prices for the last week. It takes a DataFrame containing the price data for the last week as input and returns a list of average prices for each hour of the day. The method groups the data by hour and calculates the mean price for each group.

```python
def get_average_prices_last_week(
    self, last_week_data: pd.DataFrame
) -> t.List[float]:
    """
    Calculate the average prices for the last week.

    Args:
        last_week_data (pd.DataFrame): The price data for the last week.

    Returns:
        List[float]: A list of average prices for each hour of the day.
    """
    # ... code omitted for brevity ...
    return (
        last_week_data.groupby(last_week_data.index.hour)[self.PRICE_COLUMN]
        .mean()
        .tolist()
    )
```


Below is the graph depicting the mean and standard deviation observed from the HistoricalAveragePriceModel, showcasing the simulated prices:
![Mean and std](https://raw.githubusercontent.com/koulakhilesh/OpenEnergy/master/images/notebook/prices/Mean_and_Standard_Deviation_of_GB_GBN_price_day_ahead_by_Hour.png) 

To explore the more on HistoricalAveragePriceModel , check out the Jupyter notebook [here](https://github.com/koulakhilesh/OpenEnergy/blob/master/notebooks/prices/average_price.ipynb), where its functionality is demonstrated.


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
        prior_days: int = DAYS_IN_WEEK,
    ):
        # ... code omitted for brevity ...
```

### get_prices

The `get_prices` method is the main method of the class. It takes a date as input and returns a tuple containing the forecasted prices and the actual prices for the given date. The method uses helper methods to get the current date, the date a week prior, the data for the last week, the forecasted prices for the current date, the data for the current date, and the prices for the current date.

```python
def get_prices(self, date: datetime.date) -> t.Tuple[t.List[float], t.List[float]]:
    """
    Get the forecasted prices and actual prices for a given date.

    Args:
        date (datetime.date): The date for which to get the prices.

    Returns:
        Tuple[List[float], List[float]]: A tuple containing the forecasted prices and actual prices.
    """
    # ... code omitted for brevity ...
    return forecasted_prices, prices_current_date
```

### train, forecast, evaluate, save_model, load_model

The `train`, `forecast`, `evaluate`, `save_model`, and `load_model` methods are used to train the machine learning model, forecast prices, evaluate the forecasted prices, save the trained model to a file, and load a trained model from a file, respectively.

```python
def train(self, df):
    """
    Train the forecast price model.

    Args:
        df (pandas.DataFrame): The training data.
    """
    # ... code omitted for brevity ...

def forecast(self, df):
    """
    Forecast prices using the trained model.

    Args:
        df (pandas.DataFrame): The data to forecast.

    Returns:
        pandas.DataFrame: The forecasted prices.
    """
    # ... code omitted for brevity ...

def evaluate(self, y_true, y_pred):
    """
    Evaluate the forecasted prices.

    Args:
        y_true (numpy.ndarray): The true prices.
        y_pred (numpy.ndarray): The forecasted prices.

    Returns:
        float: The evaluation metric.
    """
    # ... code omitted for brevity ...

def save_model(self, file_path):
    """
    Save the trained model to a file.

    Args:
        file_path (str): The path to the file.
    """
    # ... code omitted for brevity ...

@staticmethod
def load_model(file_path) -> IModel:
    """
    Load a trained model from a file.

    Args:
        file_path (str): The path to the file.

    Returns:
        IModel: The loaded model.
    """
    # ... code omitted for brevity ...
```

Below is the graph depicting the outcomes from the ForecastPriceModel, showcasing the simulated prices:
![Forecasted Prices](https://raw.githubusercontent.com/koulakhilesh/OpenEnergy/master/images/notebook/prices/forecast_vs_actual.png) 

To explore the more on ForecastPriceModel , check out the Jupyter notebook [here](https://github.com/koulakhilesh/OpenEnergy/blob/master/notebooks/prices/forecasted_price.ipynb), where its functionality is demonstrated.

To use any of the pricing models, you need to create an instance of the model and call the appropriate methods as defined in the interface. The specific implementation details depend on the programming language and the design of your software.

Please note that this is a high-level overview. For detailed information, refer to the specific documentation for each pricing model and the source code.

Remember, the best way to learn is by doing. So, I encourage you to clone the [repository](https://github.com/koulakhilesh/OpenEnergy/), play around with the code, and see what you can create. Happy coding!
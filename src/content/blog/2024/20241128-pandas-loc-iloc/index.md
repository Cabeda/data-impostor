---
title: "Pandas loc and iloc"
pubDate: 2024-11-28
heroImage: lookout.avif
heroImageAlt: https://unsplash.com/photos/gray-camera-VXyoRqcx7Mc
tags:
  - python
  - pandas
---

Pandas is a data manipulation library in Python. loc and iloc are two important methods used for accessing data in a DataFrame.

As a user of pandas I have wanted to write down a simple explanation of using loc and iloc in pandas.

### loc

This is the most useful one for me. We can retrieve the rows by index and the columns by name. The syntax is like df.loc[row_label, column_label] and

```python
import pandas as pd

df.loc[0] # returns the first row
df.loc[0, 'A'] # returns the first row, first column

df.loc[:2]  # returns the first two rows

df.loc[0:2, 'B']  # returns the first two rows, B column

df.loc[1:, ['A', 'B']]  # returns the first two rows, A and B columns

df.loc[df['A'] > 1]  # returns rows where A is greater than 1

df.loc[df['A'] > 1, 'B']  # returns rows where A is greater than 1, B column

df.loc[df['A'] > 2, ['B', 'C']]  # returns rows where A is greater than 2, B and C columns

df.loc[df['A'] > 1, ['B', 'C']] = 0  # set values of B and C to 0 where A is greater than 1

df.loc[0, 'A'] = 10  # set the value of A in the first row to 10

df.loc[0] = 20  # set all values in the first row to 20

df.iat[0, 0]  # returns the value in the first row, first column

```

### iloc

Although a bit less useful, if we know the index of the columns we can do exactly the same as with loc but provide the column positions instead.

```python

import pandas as pd

data = {'A': [1, 2, 3], 'B': [4, 5, 6]}

df.iloc[0]  # returns the first row

df.iloc[0, 0]  # returns the first row, first column

df.iloc[:2]  # returns the first two rows

df.iloc[0:2, 1]  # returns the first two rows, second column

df.iloc[1:, [0, 1]]  # returns the first two rows, first and second columns

```

Use loc when you want to access data by labels and iloc when you want to access data by positions.

## Bonus: at and iat

When writing this post, I found two more methods that are similar to loc and iloc. They work just like loc and iloc but are focused on retrieving a single value.

```python

import pandas as pd

data = {'A': [1, 2, 3], 'B': [4, 5, 6]}

df = pd.DataFrame(data)

df.at[0, 'A']  # Output: 1

df.iat[0, 0]  # Output: 1

```

---
title: The many layer of Athena querying
pubDate: 2024-07-09
tags:
  - athena
  - aws
---

In the past weeks I've been interacting a lot with AWS Athena and thought it would be nice to share some of the ways I've been found to query it's data. First and foremost, Athena is a serverless service that allows you to query data in S3 using SQL. You can query raw files but the tools becomes very interesting when you start using it to connect to other table types like Hive and/or Iceberg. However, I've been using the AWS console way too much and decided to go a bit further and find what were the best ways to interact with it.

## Requirements

So, for all methods below to work it's important to have your AWS credentials set up. There are multiple mechanisms ([aws docs](https://docs.aws.amazon.com/cli/v1/userguide/cli-configure-files.html)) but for this article, to simplify the process I've set an SSO profile in the `~/.aws/config` file. This allows me to just run `aws sso login`, authenticate in the browser and have a user session for the rest of the day.

## Level 1: AWS CLI

I started from the most basic way to connect to Athena, the AWS CLI. It's not shiny but frankly I already have AWS Cli installed and thought that decided to test it out. The following command will run a query and return the results.

```shell
query_execution_id=$(aws athena start-query-execution \
    --query-string "show schemas" \
    --query-execution-context Database=steering_control_data_staging \
    --work-group primary \
    --query 'QueryExecutionId' \
    --output text)

aws athena get-query-execution --query-execution-id $query_execution_id

aws athena get-query-results --query-execution-id $query_execution_id
```

As you can see, as it's a serverless solution we require 3 commands. Request data, check status of the query and finally retrieve the results. It's a bit cumbersome having to keep track of the query-id but it works. Another downside is that the results of the queries are always stored in S3 as CSV files (no data typing!).

## Level 2: Boto3

With the AWS Cli solution tested

```python
import boto3

athena_client = boto3.client('athena', region_name='eu-central-1')

query = "select from table limit 10;"

query_execution_config = {
    'QueryString': query,
    'QueryExecutionContext': {
        'Database': 'steering_control_data_staging'
    },
    'ResultConfiguration': {
        'OutputLocation': 's3://athena-outputs-590184071999/boto3results/'
    }
}

query_id = athena_client.start_query_execution(**query_execution_config)['QueryExecutionId']


def check_query_status(execution_id):
    response = athena_client.get_query_execution(QueryExecutionId=execution_id)
    return response['QueryExecution']['Status']['State']

import time

status = check_query_status(query_id)

while status in ['QUEUED', 'RUNNING']:
    time.sleep(5)
    status = check_query_status(query_id)

if status == 'SUCCEEDED':
    results = athena_client.get_query_results(QueryExecutionId=query_id)
    for row in results['ResultSet']['Rows']:
        print(row)
else:
    print(f"Query failed '{status}")
```

## Level 2.5: Hive tables using DuckDB

I was considering not adding this option because DuckDB doesn't know about Athena and the glue metastore. However, as hive tables follow a standard structure, you can technically connect to the data directly and let DuckDB infer the schema.

```sql
select * from read_parquet('s3://table/**/*.parquet', hive_partitioning=1);
```

## Level 3: PyAthena

```python
from pyathena import connect
import pandas as pd
conn = connect(
    s3_staging_dir="s3://athena-outputs-xpto/", region_name="eu-west-1"
)
df = pd.read_sql_query("select * from table limit 10;", conn)

df.head()
```

However, this method was one of the slowest and falls short for larger datasets due to it's pagination limit of 1000 rows.

## Level 4. AWS Data Wrangler

```python
import awswrangler as wr

df = wr.athena.read_sql_query("SELECT * FROM table", database="schema")

```

## Level 3.5: Pyiceberg (for iceberg tables only)

```python

from pyiceberg.catalog import load_catalog
# Query the data directly in AWS
catalog = load_catalog("default")
table = catalog.load_table("table")
df = table.scan( limit=20_000_000,
       ).to_pandas()
df.head()

```

## Readings

I've gotten a lot of inspiration from some of the articles but the sad truth is that I haven't been reading a lot with the total articles to read at 152. I'm setting as a goal of doing more than just reading so I'm yet to find a good balance.

- [Meet Figma AI: Empowering Designers with Intelligent Tools | Figma Blog](https://www.figma.com/blog/introducing-figma-ai/)
- [Open-LLM performances are plateauing, let’s make the leaderboard steep again - a Hugging Face Space by open-llm-leaderboard](https://huggingface.co/spaces/open-llm-leaderboard/blog)
- [What's Next for Apache Spark™ Including the Upcoming Release of Apache Spark 4.0 by Databricks](https://youtube.com/watch?si=pk0ongoWDVxyzUWu&v=S1B0J-uzSDE): High level but the future looks good for spark
- [AWS re:Invent 2023 - Democratize ML with no code/low code using Amazon SageMaker Canvas (AIM217) by AWS Events](https://www.youtube.com/watch?v=GBIkeMemh2E): The AI platform looks like a great idea. The solution is way expensive but if well used it should drive for teams to make great predictions and remove lot's of manual work
- [DuckDB + dbt : Accelerating the developer experience with local power by MotherDuck](https://www.youtube.com/watch?v=Baoay4k2b34): Really nice interview of the dbt duckdb adapter

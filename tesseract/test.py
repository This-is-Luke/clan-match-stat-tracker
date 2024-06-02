def calculate_costs(total_users, peak_percentage, peak_days, data_per_session_gb, sessions_per_user_per_day, api_calls_per_session, rates):
    peak_users = total_users * peak_percentage
    regular_users = total_users * (1 - peak_percentage)
    regular_days = 30 - peak_days
    daily_regular_users = regular_users / regular_days

    # Data usage calculations
    peak_daily_data_gb = peak_users * data_per_session_gb * sessions_per_user_per_day
    total_peak_data_gb = peak_daily_data_gb * peak_days
    regular_daily_data_gb = daily_regular_users * \
        data_per_session_gb * sessions_per_user_per_day
    total_regular_data_gb = regular_daily_data_gb * regular_days
    total_data_gb = total_peak_data_gb + total_regular_data_gb

    # API Gateway and Lambda invocations
    peak_api_calls = peak_users * api_calls_per_session * sessions_per_user_per_day
    total_peak_api_calls = peak_api_calls * peak_days
    regular_api_calls = daily_regular_users * \
        api_calls_per_session * sessions_per_user_per_day
    total_regular_api_calls = regular_api_calls * regular_days
    total_api_calls = total_peak_api_calls + total_regular_api_calls

    # DynamoDB read/write operations
    dynamodb_writes = total_api_calls  # assuming one write per API call
    dynamodb_reads = total_api_calls  # assuming one read per API call

    # Adjusted instance counts for smaller user bases
    peak_g5_instances = max(1, int(20 * (total_users / 4_000_000)))
    regular_g5_instances = max(1, int(10 * (total_users / 4_000_000)))
    regular_t3_instances = max(1, int(20 * (total_users / 4_000_000)))

    # EC2 costs
    peak_g5_cost = peak_g5_instances * rates['g5_xlarge'] * 12 * peak_days
    regular_g5_cost = regular_g5_instances * \
        rates['g5_xlarge'] * 12 * regular_days
    regular_t3_cost = regular_t3_instances * rates['t3_medium'] * 24 * 30
    total_ec2_cost = peak_g5_cost + regular_g5_cost + regular_t3_cost

    # Data transfer costs
    data_transfer_cost_first_100TB = min(
        100 * 1024, total_data_gb) * rates['data_transfer_first_100TB']
    data_transfer_cost_rest = max(
        0, total_data_gb - 100 * 1024) * rates['data_transfer_rest']
    total_data_transfer_cost = data_transfer_cost_first_100TB + data_transfer_cost_rest

    # S3 storage costs
    s3_storage_cost = 10 * 1024 * rates['s3_storage']

    # ELB costs
    elb_cost = 720 * rates['elb_hourly']
    elb_data_processing_cost = total_data_gb * \
        0.1 * rates['elb_data_processing']
    total_elb_cost = elb_cost + elb_data_processing_cost

    # CloudFront costs
    cloudfront_cost = total_data_gb * 0.1 * rates['cloudfront_data_transfer']

    # API Gateway costs
    api_gateway_cost = total_api_calls * rates['api_gateway_request']

    # Lambda costs
    lambda_invocations_cost = total_api_calls * rates['lambda_request']
    lambda_execution_cost = (
        total_api_calls * rates['lambda_execution_time'] * rates['lambda_memory_mb']) / 1024 / 60

    # DynamoDB costs
    dynamodb_write_cost = dynamodb_writes * rates['dynamodb_write']
    dynamodb_read_cost = dynamodb_reads * rates['dynamodb_read']

    # Total cost
    total_cost = (
        total_ec2_cost +
        total_data_transfer_cost +
        s3_storage_cost +
        total_elb_cost +
        cloudfront_cost +
        api_gateway_cost +
        lambda_invocations_cost +
        lambda_execution_cost +
        dynamodb_write_cost +
        dynamodb_read_cost
    )

    return {
        "EC2 Cost": total_ec2_cost,
        "Data Transfer Cost": total_data_transfer_cost,
        "S3 Storage Cost": s3_storage_cost,
        "ELB Cost": total_elb_cost,
        "CloudFront Cost": cloudfront_cost,
        "API Gateway Cost": api_gateway_cost,
        "Lambda Cost": lambda_invocations_cost + lambda_execution_cost,
        "DynamoDB Cost": dynamodb_write_cost + dynamodb_read_cost,
        "Total Cost": total_cost
    }


# Updated rates from AWS pricing for Ireland (EU West 2)
rates = {
    "g5_xlarge": 1.006,
    "t3_medium": 0.0416,
    "data_transfer_first_100TB": 0.09,
    "data_transfer_rest": 0.085,
    "s3_storage": 0.023,
    "elb_hourly": 0.025,
    "elb_data_processing": 0.008,
    "cloudfront_data_transfer": 0.085,
    "api_gateway_request": 0.0001,
    "lambda_request": 0.0000002,
    "lambda_execution_time": 0.00001667,
    "lambda_memory_mb": 128,
    "dynamodb_write": 0.0008,
    "dynamodb_read": 0.0004
}

# Constants
data_per_session_gb = 10 / 1024  # 10 MB to GB
sessions_per_user_per_day = 2
api_calls_per_session = 1

# Test scenarios with different user counts
user_counts = [1_000, 5_000, 10_000, 20_000, 50_000, 100000, 4000000]
results = {count: calculate_costs(count, 0.35, 2, data_per_session_gb,
                                  sessions_per_user_per_day, api_calls_per_session, rates) for count in user_counts}

for count in user_counts:
    print(f"{count} Users Scenario:", results[count])

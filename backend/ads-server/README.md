# Campaign API Documentation

This document describes the complete CRUD operations for the Facebook Campaigns API endpoints.

## Base URL
```
http://localhost:3000/api/campaigns
```

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Create Campaign
Create a new Facebook advertising campaign.

**Endpoint:** `POST /api/campaigns`

**Request Body:**
```json
{
  "name": "Summer Collection 2024",
  "objective": "LINK_CLICKS",
  "status": "PAUSED",
  "dailyBudget": 50.00,
  "bidStrategy": "LOWEST_COST_WITHOUT_CAP",
  "startTime": "2024-07-01T00:00:00Z",
  "endTime": "2024-08-31T23:59:59Z",
  "targetingSpec": {
    "ageMin": 18,
    "ageMax": 65,
    "genders": [1, 2],
    "geoLocations": {
      "countries": ["US", "CA"]
    },
    "interests": [
      {
        "id": "6003139266461",
        "name": "Fashion"
      }
    ]
  },
  "facebookAdAccountId": "act_123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Campaign created successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "userId": "user123",
    "name": "Summer Collection 2024",
    "objective": "LINK_CLICKS",
    "status": "PAUSED",
    "dailyBudget": 50,
    "bidStrategy": "LOWEST_COST_WITHOUT_CAP",
    "facebookAdAccountId": "act_123456789",
    "createdAt": "2024-07-01T10:00:00Z",
    "updatedAt": "2024-07-01T10:00:00Z"
  }
}
```

### 2. Get All Campaigns
Retrieve campaigns with filtering and pagination.

**Endpoint:** `GET /api/campaigns`

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `sortBy` (string): Sort field (default: "createdAt")
- `sortOrder` (string): "asc" or "desc" (default: "desc")
- `status` (string): Filter by status ("ACTIVE", "PAUSED", "ARCHIVED", "DELETED")
- `objective` (string): Filter by objective
- `facebookAdAccountId` (string): Filter by Facebook ad account
- `startDate` (string): Filter campaigns created after this date
- `endDate` (string): Filter campaigns created before this date

**Example:** `GET /api/campaigns?status=ACTIVE&limit=5&page=1`

**Response:**
```json
{
  "success": true,
  "message": "Campaigns retrieved successfully",
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789012345",
      "name": "Summer Collection 2024",
      "objective": "LINK_CLICKS",
      "status": "ACTIVE",
      "dailyBudget": 50,
      "impressions": 15230,
      "clicks": 412,
      "spend": 127.45,
      "ctr": 2.71,
      "createdAt": "2024-07-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 25,
    "totalPages": 5
  }
}
```

### 3. Get Campaign by ID
Retrieve a specific campaign.

**Endpoint:** `GET /api/campaigns/:id`

**Response:**
```json
{
  "success": true,
  "message": "Campaign retrieved successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "userId": "user123",
    "name": "Summer Collection 2024",
    "objective": "LINK_CLICKS",
    "status": "ACTIVE",
    "dailyBudget": 50,
    "targetingSpec": {
      "ageMin": 18,
      "ageMax": 65,
      "geoLocations": {
        "countries": ["US", "CA"]
      }
    },
    "facebookAdAccountId": "act_123456789",
    "facebookCampaignId": "23846781234567890",
    "impressions": 15230,
    "clicks": 412,
    "spend": 127.45,
    "conversions": 23,
    "ctr": 2.71,
    "cpc": 0.31,
    "roas": 3.45,
    "createdAt": "2024-07-01T10:00:00Z",
    "updatedAt": "2024-07-15T14:30:00Z"
  }
}
```

### 4. Update Campaign
Update an existing campaign.

**Endpoint:** `PUT /api/campaigns/:id`

**Request Body:** (All fields are optional)
```json
{
  "name": "Updated Campaign Name",
  "status": "ACTIVE",
  "dailyBudget": 75.00,
  "targetingSpec": {
    "ageMin": 25,
    "ageMax": 45
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Campaign updated successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "name": "Updated Campaign Name",
    "status": "ACTIVE",
    "dailyBudget": 75,
    "updatedAt": "2024-07-15T16:00:00Z"
  }
}
```

### 5. Delete Campaign
Delete a campaign.

**Endpoint:** `DELETE /api/campaigns/:id`

**Response:**
```json
{
  "success": true,
  "message": "Campaign deleted successfully"
}
```

### 6. Pause Campaign
Pause a running campaign.

**Endpoint:** `POST /api/campaigns/:id/pause`

**Response:**
```json
{
  "success": true,
  "message": "Campaign paused successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "status": "PAUSED",
    "updatedAt": "2024-07-15T16:15:00Z"
  }
}
```

### 7. Activate Campaign
Activate a paused campaign.

**Endpoint:** `POST /api/campaigns/:id/activate`

**Response:**
```json
{
  "success": true,
  "message": "Campaign activated successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "status": "ACTIVE",
    "updatedAt": "2024-07-15T16:20:00Z"
  }
}
```

### 8. Archive Campaign
Archive a campaign.

**Endpoint:** `POST /api/campaigns/:id/archive`

**Response:**
```json
{
  "success": true,
  "message": "Campaign archived successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "status": "ARCHIVED",
    "updatedAt": "2024-07-15T16:25:00Z"
  }
}
```

### 9. Duplicate Campaign
Create a copy of an existing campaign.

**Endpoint:** `POST /api/campaigns/:id/duplicate`

**Response:**
```json
{
  "success": true,
  "message": "Campaign duplicated successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012999",
    "name": "Summer Collection 2024 (Copy)",
    "status": "PAUSED",
    "objective": "LINK_CLICKS",
    "dailyBudget": 50,
    "createdAt": "2024-07-15T16:30:00Z"
  }
}
```

### 10. Get Campaign Insights
Retrieve performance data for a campaign.

**Endpoint:** `GET /api/campaigns/:id/insights`

**Query Parameters:**
- `start` (string): Start date for insights (ISO 8601 format)
- `end` (string): End date for insights (ISO 8601 format)

**Example:** `GET /api/campaigns/64a1b2c3d4e5f6789012345/insights?start=2024-07-01&end=2024-07-15`

**Response:**
```json
{
  "success": true,
  "message": "Campaign insights retrieved successfully",
  "data": {
    "impressions": 15230,
    "clicks": 412,
    "spend": 127.45,
    "conversions": 23,
    "ctr": 2.71,
    "cpc": 0.31,
    "cpm": 8.37,
    "roas": 3.45,
    "frequency": 1.23,
    "reach": 12384
  }
}
```

### 11. Bulk Operations
Perform operations on multiple campaigns at once.

**Endpoint:** `POST /api/campaigns/bulk`

**Request Body:**
```json
{
  "campaignIds": [
    "64a1b2c3d4e5f6789012345",
    "64a1b2c3d4e5f6789012346",
    "64a1b2c3d4e5f6789012347"
  ],
  "operation": "pause"
}
```

**Operations:** `pause`, `activate`, `archive`, `delete`

**Response:**
```json
{
  "success": true,
  "message": "Bulk operation completed. 3 successful, 0 failed.",
  "data": {
    "success": 3,
    "failed": 0,
    "errors": []
  }
}
```

### 12. Sync with Facebook
Sync campaigns from Facebook Ad Account.

**Endpoint:** `POST /api/campaigns/sync`

**Request Body:**
```json
{
  "facebookAdAccountId": "act_123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sync completed. 5 campaigns synced.",
  "data": {
    "synced": 5,
    "errors": []
  }
}
```

## Campaign Objectives
Available campaign objectives:
- `AWARENESS` - Brand awareness
- `TRAFFIC` - Website traffic
- `ENGAGEMENT` - Post engagement
- `LEADS` - Lead generation
- `APP_INSTALLS` - App installs
- `SALES` - Sales and conversions
- `LINK_CLICKS` - Link clicks (most common)
- `POST_ENGAGEMENT` - Post engagement
- `PAGE_LIKES` - Page likes
- `EVENT_RESPONSES` - Event responses
- `MESSAGES` - Messages
- `CONVERSIONS` - Conversions
- `CATALOG_SALES` - Catalog sales
- `STORE_TRAFFIC` - Store traffic

## Campaign Status
- `ACTIVE` - Campaign is running
- `PAUSED` - Campaign is paused
- `ARCHIVED` - Campaign is archived
- `DELETED` - Campaign is deleted

## Bid Strategies
- `LOWEST_COST_WITHOUT_CAP` - Automatic bidding (default)
- `LOWEST_COST_WITH_BID_CAP` - Automatic bidding with bid cap
- `TARGET_COST` - Target cost bidding
- `COST_CAP` - Cost cap bidding

## Error Responses
All endpoints may return these error responses:

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "User not authenticated"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Campaign not found"
}
```

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Name, objective, and Facebook ad account ID are required"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to create campaign",
  "error": "Detailed error message"
}
```

## Example Facebook API Call
The campaigns endpoint integrates with Facebook's Marketing API. Here's how the equivalent Facebook API call would look:

```bash
curl -X POST \
  https://graph.facebook.com/v23.0/act_<AD_ACCOUNT_ID>/campaigns \
  -F 'name=My Campaign' \
  -F 'objective=LINK_CLICKS' \
  -F 'status=PAUSED' \
  -F 'access_token=<ACCESS_TOKEN>'
```

Our API abstracts this complexity and provides additional features like:
- User authentication and authorization
- Campaign management and tracking
- Performance metrics storage
- Bulk operations
- Campaign duplication
- Advanced filtering and pagination

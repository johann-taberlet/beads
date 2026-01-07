# Risk Scoring Data Model & Weighting Logic

This document defines the risk assessment model used in the Beads platform. Each answer choice in the quiz can influence one or more risk categories by applying modifiers (scores).

## 1. Risk Categories

The system evaluates leads across five primary risk categories:

| Category | Description | Focus Areas |
| :--- | :--- | :--- |
| **Fire** | Risk of property damage due to fire. | Construction material, heating systems, safety equipment. |
| **Theft** | Risk of burglary or asset loss. | Security systems, neighborhood, high-value item ownership. |
| **Legal** | Liability risks and legal exposure. | Property use (commercial vs residential), dog ownership, professional activities. |
| **Natural** | Environmental and weather-related risks. | Location (flood zones), roof type, age of construction. |
| **Cyber** | Data breach and digital security risks. | Business activity, digital infrastructure, remote work policies. |

## 2. Scoring Mechanism

### 2.1. Modifier Types
- **Positive (+) Score**: Increases the risk profile for that category (e.g., +0.2).
- **Negative (-) Score**: Decreases the risk profile, acting as a mitigation (e.g., -0.15).

### 2.2. Score Ranges
Scores are normalized between **-1.0** (Highly Mitigated) and **1.0** (Extremely High Risk).
The final risk score for a category is the sum of all individual modifiers, clamped between **0.0** and **1.0** for visualization purposes.

## 3. Weighting Reference Table (Draft)

Below are representative weights for common discovery questions.

### 3.1. Property Foundation
| Answer Choice | Category | Modifier | Rationale |
| :--- | :--- | :--- | :--- |
| Commercial Building | Legal | +0.15 | Higher liability due to public/employee access. |
| Commercial Building | Fire | +0.10 | Complex electrical/industrial systems. |
| Residential Home | Legal | +0.05 | Standard homeowner liability. |

### 3.2. Structural Details
| Answer Choice | Category | Modifier | Rationale |
| :--- | :--- | :--- | :--- |
| Flat Bitumen Roof | Natural | +0.20 | Prone to pooling and leaks. |
| Flat Bitumen Roof | Fire | +0.10 | More flammable than tile/metal. |
| Pitched Tile Roof | Natural | -0.10 | Better water/snow runoff. |
| Pitched Tile Roof | Fire | -0.05 | Non-combustible material. |

### 3.3. Security & Safety
| Answer Choice | Category | Modifier | Rationale |
| :--- | :--- | :--- | :--- |
| Professionally Monitored | Theft | -0.30 | Highest level of deterrence and response. |
| Local Alarm Only | Theft | -0.15 | Basic deterrence. |
| No Security System | Theft | +0.20 | High vulnerability. |

### 3.4. Assets & Liabilities
| Answer Choice | Category | Modifier | Rationale |
| :--- | :--- | :--- | :--- |
| Owns a Dog (Aggressive) | Legal | +0.20 | Increased bite liability. |
| Jewelry (> $5k) | Theft | +0.20 | High-value target for theft. |
| Fine Art | Fire | +0.10 | Irreplaceable value in fire scenarios. |

### 3.5. Business Activity
| Answer Choice | Category | Modifier | Rationale |
| :--- | :--- | :--- | :--- |
| Office / Tech | Cyber | +0.20 | High reliance on digital assets. |
| Retail | Theft | +0.10 | Inventory risk. |
| Warehouse | Fire | +0.20 | Large open spaces and heavy storage. |

## 4. Calculation Engine Logic
The `RiskCalculator` component should:
1. Initialize all categories to `0.0`.
2. Iterate through all selected answers.
3. Sum the `riskScores` modifiers for each category.
4. Normalize the result (e.g., using a sigmoid or simple clamping) to a 0-100% scale for UI gauges.

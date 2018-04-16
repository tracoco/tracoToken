# Basic Traco Protocols and Reference Implementation

```
  API/
  GUI/etc.
 +---------+--------------------------+-----------------------------+----+---------------+
           |   +--------------------+ | +---------+  +---------+    |    |  COCO Exchange
           |   | Liquidity Applicant| | |Liquidity|  |Liquidity|    |    |
 (1)       |   +---+-+---+-+----+-+-+ | |Provider |  |Applicant|    |    |  +----+
 Traco     |       | ^   | ^    | ^   | +---+-+---+  +--+-+----+    |    |  |COC+----+
 TownCrier |      1| |2 4| |6  7| |9  |     | ^         | ^         |    |  +---+CO+----+
 (2)       |       v +   | |    | |   |     | |         | |      ...|    |      +--+COCO|
 KYC       |       (1)   | |    | |   |     v +         v +         |    |         +----+
 Verifier  |         +   v +    | |   |     (1)         (4)<-----------------+
 (3)       |DApps   3|   (2) <-----------------------------------------------+
 Loan      |Traco    |   + ^ 8  v +   |                             |    |
 Onboard   |Party    |  5| +---+(3)   | TracoDoc                    | ...|
 (4)       +---------v---v------------+-----------------------------+----+
 Apply     |                 +---+       +-----+                         |
 Loan      |              +--+TRC|   +---+Asset|                         |
           |              |TR+---+   |Ass+-----+  ...                    |
Service    |  TracoVault  +---|      +-----|                             |
Pool       +-------------------------------------------------------------+
           +                                                             ++
```
## Sample Workflow Steps:
1. Identity profile
2. 20 TRC
3. Identity asset
4. Assign KYC Verifier with Identity asset id and 10TRC
5. Signed Identity asset
6. Event
7. Loan Onboarding with signed identity asset
8. 100 TRC
9. 10 TRC

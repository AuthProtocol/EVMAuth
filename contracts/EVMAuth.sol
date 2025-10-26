// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title EVMAuth
 * @dev AI Agent Payment Authorization System
 * @notice Manages agent registration and payment authorization on BSC
 */
contract EVMAuth {

    // Enums
    enum AgentType { Trading, Analytics, Content, DeFi }
    enum AgentStatus { Pending, Active, Inactive }
    enum PaymentStatus { Pending, Settled, Failed }

    // Structs
    struct Agent {
        string name;
        AgentType agentType;
        string did;
        uint256 maxDailySpend;
        AgentStatus status;
        address owner;
        uint256 createdAt;
        uint256 dailySpent;
        uint256 lastResetTimestamp;
    }

    struct Payment {
        uint256 agentId;
        address recipient;
        uint256 amount;
        PaymentStatus status;
        uint256 timestamp;
        string memo;
    }

    // State Variables
    mapping(uint256 => Agent) public agents;
    mapping(uint256 => Payment) public payments;
    mapping(address => uint256[]) public userAgents;
    mapping(address => uint256[]) public userPayments;

    uint256 public agentCounter;
    uint256 public paymentCounter;

    // Events
    event AgentCreated(
        uint256 indexed agentId,
        address indexed owner,
        string name,
        AgentType agentType,
        uint256 maxDailySpend
    );

    event AgentStatusUpdated(
        uint256 indexed agentId,
        AgentStatus newStatus
    );

    event PaymentAuthorized(
        uint256 indexed paymentId,
        uint256 indexed agentId,
        address indexed recipient,
        uint256 amount
    );

    event PaymentSettled(
        uint256 indexed paymentId,
        uint256 indexed agentId,
        address indexed recipient,
        uint256 amount
    );

    event PaymentFailed(
        uint256 indexed paymentId,
        string reason
    );

    // Modifiers
    modifier onlyAgentOwner(uint256 _agentId) {
        require(agents[_agentId].owner == msg.sender, "Not agent owner");
        _;
    }

    modifier agentExists(uint256 _agentId) {
        require(_agentId < agentCounter, "Agent does not exist");
        _;
    }

    modifier agentActive(uint256 _agentId) {
        require(agents[_agentId].status == AgentStatus.Active, "Agent not active");
        _;
    }

    /**
     * @dev Create a new AI agent
     * @param _name Agent name
     * @param _agentType Type of agent (0-3)
     * @param _did Decentralized Identifier
     * @param _maxDailySpend Maximum daily spending limit in wei
     */
    function createAgent(
        string memory _name,
        AgentType _agentType,
        string memory _did,
        uint256 _maxDailySpend
    ) external returns (uint256) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_maxDailySpend > 0, "Max daily spend must be greater than 0");

        uint256 agentId = agentCounter++;

        agents[agentId] = Agent({
            name: _name,
            agentType: _agentType,
            did: _did,
            maxDailySpend: _maxDailySpend,
            status: AgentStatus.Pending,
            owner: msg.sender,
            createdAt: block.timestamp,
            dailySpent: 0,
            lastResetTimestamp: block.timestamp
        });

        userAgents[msg.sender].push(agentId);

        emit AgentCreated(agentId, msg.sender, _name, _agentType, _maxDailySpend);

        return agentId;
    }

    /**
     * @dev Activate an agent
     * @param _agentId ID of the agent to activate
     */
    function activateAgent(uint256 _agentId)
        external
        onlyAgentOwner(_agentId)
        agentExists(_agentId)
    {
        require(agents[_agentId].status != AgentStatus.Active, "Agent already active");

        agents[_agentId].status = AgentStatus.Active;

        emit AgentStatusUpdated(_agentId, AgentStatus.Active);
    }

    /**
     * @dev Deactivate an agent
     * @param _agentId ID of the agent to deactivate
     */
    function deactivateAgent(uint256 _agentId)
        external
        onlyAgentOwner(_agentId)
        agentExists(_agentId)
    {
        agents[_agentId].status = AgentStatus.Inactive;

        emit AgentStatusUpdated(_agentId, AgentStatus.Inactive);
    }

    /**
     * @dev Authorize a payment from an agent
     * @param _agentId ID of the agent making the payment
     * @param _recipient Address to receive the payment
     * @param _memo Optional payment memo
     */
    function authorizePayment(
        uint256 _agentId,
        address _recipient,
        string memory _memo
    )
        external
        payable
        onlyAgentOwner(_agentId)
        agentExists(_agentId)
        agentActive(_agentId)
    {
        require(_recipient != address(0), "Invalid recipient");
        require(msg.value > 0, "Payment amount must be greater than 0");

        Agent storage agent = agents[_agentId];

        // Reset daily spent if 24 hours have passed
        if (block.timestamp >= agent.lastResetTimestamp + 1 days) {
            agent.dailySpent = 0;
            agent.lastResetTimestamp = block.timestamp;
        }

        // Check daily spending limit
        require(
            agent.dailySpent + msg.value <= agent.maxDailySpend,
            "Exceeds daily spending limit"
        );

        uint256 paymentId = paymentCounter++;

        payments[paymentId] = Payment({
            agentId: _agentId,
            recipient: _recipient,
            amount: msg.value,
            status: PaymentStatus.Pending,
            timestamp: block.timestamp,
            memo: _memo
        });

        userPayments[msg.sender].push(paymentId);

        emit PaymentAuthorized(paymentId, _agentId, _recipient, msg.value);

        // Auto-settle payment
        _settlePayment(paymentId);
    }

    /**
     * @dev Internal function to settle a payment
     * @param _paymentId ID of the payment to settle
     */
    function _settlePayment(uint256 _paymentId) internal {
        Payment storage payment = payments[_paymentId];
        Agent storage agent = agents[payment.agentId];

        // Transfer funds
        (bool success, ) = payment.recipient.call{value: payment.amount}("");

        if (success) {
            payment.status = PaymentStatus.Settled;
            agent.dailySpent += payment.amount;

            emit PaymentSettled(
                _paymentId,
                payment.agentId,
                payment.recipient,
                payment.amount
            );
        } else {
            payment.status = PaymentStatus.Failed;

            emit PaymentFailed(_paymentId, "Transfer failed");
        }
    }

    /**
     * @dev Get agent details
     * @param _agentId ID of the agent
     */
    function getAgent(uint256 _agentId)
        external
        view
        agentExists(_agentId)
        returns (Agent memory)
    {
        return agents[_agentId];
    }

    /**
     * @dev Get all agents owned by an address
     * @param _owner Address of the owner
     */
    function getUserAgents(address _owner)
        external
        view
        returns (uint256[] memory)
    {
        return userAgents[_owner];
    }

    /**
     * @dev Get payment details
     * @param _paymentId ID of the payment
     */
    function getPayment(uint256 _paymentId)
        external
        view
        returns (Payment memory)
    {
        require(_paymentId < paymentCounter, "Payment does not exist");
        return payments[_paymentId];
    }

    /**
     * @dev Get all payments for a user
     * @param _user Address of the user
     */
    function getUserPayments(address _user)
        external
        view
        returns (uint256[] memory)
    {
        return userPayments[_user];
    }

    /**
     * @dev Update agent's max daily spend
     * @param _agentId ID of the agent
     * @param _newMaxDailySpend New maximum daily spend
     */
    function updateMaxDailySpend(uint256 _agentId, uint256 _newMaxDailySpend)
        external
        onlyAgentOwner(_agentId)
        agentExists(_agentId)
    {
        require(_newMaxDailySpend > 0, "Max daily spend must be greater than 0");
        agents[_agentId].maxDailySpend = _newMaxDailySpend;
    }

    /**
     * @dev Get remaining daily budget for an agent
     * @param _agentId ID of the agent
     */
    function getRemainingDailyBudget(uint256 _agentId)
        external
        view
        agentExists(_agentId)
        returns (uint256)
    {
        Agent memory agent = agents[_agentId];

        // If 24 hours have passed, full budget is available
        if (block.timestamp >= agent.lastResetTimestamp + 1 days) {
            return agent.maxDailySpend;
        }

        if (agent.dailySpent >= agent.maxDailySpend) {
            return 0;
        }

        return agent.maxDailySpend - agent.dailySpent;
    }
}

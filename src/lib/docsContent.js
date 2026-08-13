// In-app documentation content, rendered by src/app/docs/page.jsx.
// Each section declares its own audience so the docs page can filter the
// table of contents to what the signed-in user can actually do:
//   { roles: [...] }   -- visible to profiles.role in this list.
//                          'customer' is a synthetic token meaning
//                          role is null/undefined and not an admin.
//   { module: 'x' }     -- visible if canViewModule(profile, roles, 'x')
//                          (mirrors the admin sidebar's own gating).
//   'all'                -- always visible to any signed-in user.
//   'adminArea'          -- visible to is_admin or any operational role
//                          (admin/manager/accountant/warehouse_staff/
//                          sales_agent/cashier) -- for admin-wide pages
//                          that aren't tied to one permission module.

export const ADMIN_AREA_ROLES = ["admin", "manager", "accountant", "warehouse_staff", "sales_agent", "cashier"];

export const DOCS = [
  // ------------------------------------------------------------------
  // Getting started -- everyone
  // ------------------------------------------------------------------
  {
    id: "platform-overview",
    group: "Getting started",
    title: "What Highland Cargo is",
    audience: "all",
    summary: "A quick orientation to the platform and who uses it.",
    body: [
      "Highland Cargo Africa is a freight-forwarding and sourcing platform connecting overseas suppliers (China, Dubai, UK) to buyers across East Africa. The public site is a product catalog and quote-request storefront; behind login, it's a full operations system: quotations, orders, invoicing and payments, purchasing, warehouse inventory, shipments, a point-of-sale counter, HR, and reporting.",
      "Four kinds of people use it: customers (anyone who signs up to browse products, request quotes, and track shipments), suppliers (overseas vendors who list products and fulfil orders), partners (regional resellers with access to partner-only catalogs), and staff (Highland Cargo's own team, who run the admin console under one of six operational roles).",
    ],
    notes: [
      "This documentation only shows you the sections relevant to your account -- what you see here is what you can actually do.",
    ],
  },
  {
    id: "roles-overview",
    group: "Getting started",
    title: "Roles on the platform",
    audience: "all",
    summary: "The account types and what each one is for.",
    body: [
      "Every account has a role stored on your profile. It decides what you see after logging in and what the system lets you do.",
    ],
    table: {
      headers: ["Role", "Who", "Lands on"],
      rows: [
        ["Customer", "Anyone who signs up without choosing supplier/partner", "/dashboard"],
        ["Supplier", "Overseas vendor listing products", "/supplier"],
        ["Partner", "Regional reseller with catalog access", "/partner"],
        ["Admin", "Full system access, including user & role management", "/admin"],
        ["Manager", "Operations -- most modules except users/roles", "/admin"],
        ["Accountant", "Invoicing, payments, expenses, financial reports", "/admin"],
        ["Warehouse staff", "Products, inventory, stock transfers/adjustments", "/admin"],
        ["Sales agent", "Quotations, orders, customer contacts", "/admin"],
        ["Cashier", "POS terminal, payments, delivery notes", "/admin"],
      ],
    },
  },
  {
    id: "signing-in",
    group: "Getting started",
    title: "Signing in",
    audience: "all",
    summary: "Highland Cargo uses passwordless magic-link sign-in.",
    body: ["There's no password to remember."],
    actions: [
      {
        label: "Sign in",
        steps: [
          "Go to /auth.",
          "Enter your email address and select Send Magic Link.",
          "Open the email Highland Cargo sends you and click the link -- it signs you in and returns you to the app.",
          "If you're a brand-new user with no role yet, you'll land on Choose Your Role to pick Supplier or Partner (staff accounts are assigned a role by an admin, not self-selected).",
        ],
      },
    ],
  },

  // ------------------------------------------------------------------
  // Customer guide
  // ------------------------------------------------------------------
  {
    id: "customer-catalog",
    group: "Customer guide",
    title: "Browsing the product catalog",
    audience: { roles: ["customer"] },
    summary: "Search and filter products sourced from Dubai, China and the UK.",
    actions: [
      {
        label: "Browse and filter products",
        steps: [
          "Go to /products.",
          "Use the search box, region filter (Dubai / China / UK) and category filter to narrow the list.",
          "Sort by price using the sort control.",
          "Select a product to open its detail page -- images, pricing tiers, and supplier info.",
        ],
      },
      {
        label: "Contact a supplier about a product",
        steps: [
          "From a product page, select Chat with Supplier.",
          "If you're not signed in you'll be sent to /auth first; once signed in you're taken to the chat/inquiry flow.",
        ],
      },
    ],
  },
  {
    id: "customer-quote",
    group: "Customer guide",
    title: "Requesting a freight quote",
    audience: { roles: ["customer"] },
    summary: "Ask Highland Cargo to quote a shipment.",
    actions: [
      {
        label: "Submit a quote request",
        steps: [
          "Go to the Contact section of the homepage (or /contact).",
          "Fill in your name, email, phone, service type and a description of what you need shipped.",
          "Select Request a Quote.",
          "A sales agent or admin will follow up and, once priced, can convert your request into a formal quotation and order in the admin console.",
        ],
      },
    ],
  },
  {
    id: "customer-dashboard",
    group: "Customer guide",
    title: "Your dashboard",
    audience: { roles: ["customer"] },
    summary: "Where you land after signing in.",
    body: [
      "Go to /dashboard. The Overview tab links out to the partner product catalogs; the Profile tab shows your account email and current role.",
    ],
  },

  // ------------------------------------------------------------------
  // Supplier portal
  // ------------------------------------------------------------------
  {
    id: "supplier-onboarding",
    group: "Supplier portal",
    title: "Onboarding",
    audience: { roles: ["supplier"] },
    summary: "A 5-step verification flow before your account is fully active.",
    actions: [
      {
        label: "Complete onboarding",
        steps: [
          "Company Details -- your company name and country. This creates your supplier record.",
          "Contact Info -- a contact email and phone number.",
          "Add Product -- list your first product (name, category, price, region, description), or select Skip for now.",
          "Bank Setup -- your settlement account details.",
          "KYC Upload -- upload a business registration document.",
        ],
      },
    ],
    notes: [
      "You can't place or manage real orders until an admin approves your account from Contacts > Suppliers (status moves from Pending Verification to Verified).",
    ],
  },
  {
    id: "supplier-overview",
    group: "Supplier portal",
    title: "Overview",
    audience: { roles: ["supplier"] },
    summary: "Your at-a-glance dashboard.",
    body: ["Shows your total product count and shipment counts by status (pending, in transit, delivered)."],
  },
  {
    id: "supplier-products",
    group: "Supplier portal",
    title: "Products",
    audience: { roles: ["supplier"] },
    summary: "List what you sell.",
    actions: [
      {
        label: "Add a product",
        steps: [
          "In your supplier dashboard, open the Products tab.",
          "Select Add Product.",
          "Fill in name, category, price, region and description, then Save.",
        ],
      },
      {
        label: "View your products",
        steps: ["The Products tab lists everything you've listed, with category, region and price."],
      },
    ],
    notes: ["Editing and deleting your own listed products isn't available yet in this release -- contact an admin if a listing needs to change or come down."],
  },
  {
    id: "supplier-shipments",
    group: "Supplier portal",
    title: "Shipments",
    audience: { roles: ["supplier"] },
    summary: "Track and progress orders you're fulfilling.",
    actions: [
      {
        label: "Update a shipment's status",
        steps: [
          "Open the Shipments tab.",
          "Use the quick-action buttons on a shipment row (e.g. Sourcing, In Transit) to move it forward.",
        ],
      },
    ],
  },
  {
    id: "supplier-team",
    group: "Supplier portal",
    title: "Team",
    audience: { roles: ["supplier"] },
    summary: "See who else at your company has access.",
    body: ["The Team tab lists members linked to your supplier account and what they can manage."],
    notes: ["Adding and removing team members from this screen isn't available yet in this release."],
  },
  {
    id: "supplier-messages",
    group: "Supplier portal",
    title: "Messages",
    audience: { roles: ["supplier"] },
    summary: "Reply to customer and admin inquiries.",
    actions: [
      {
        label: "Send a message",
        steps: [
          "Open the Messages tab.",
          "Write your message (optionally reference a product or shipment ID) and select Send.",
        ],
      },
    ],
  },
  {
    id: "supplier-profile",
    group: "Supplier portal",
    title: "Profile",
    audience: { roles: ["supplier"] },
    summary: "Your account details.",
    body: ["Read-only view of your profile information."],
  },

  // ------------------------------------------------------------------
  // Partner portal
  // ------------------------------------------------------------------
  {
    id: "partner-onboarding",
    group: "Partner portal",
    title: "Onboarding",
    audience: { roles: ["partner"] },
    summary: "A 3-step setup for regional partner accounts.",
    actions: [
      {
        label: "Complete onboarding",
        steps: [
          "Company Details -- your company/partner name and country.",
          "Contact Info -- contact email and phone.",
          "Warehouse Preference -- pick which sourcing region's catalog you see first (Dubai, China or UK).",
          "Select Finish to create your partner account.",
        ],
      },
    ],
  },
  {
    id: "partner-overview",
    group: "Partner portal",
    title: "Overview",
    audience: { roles: ["partner"] },
    summary: "Your shipment counts at a glance.",
    body: ["Shows total, pending and delivered shipment counts, plus a recent-shipments list."],
  },
  {
    id: "partner-shipments",
    group: "Partner portal",
    title: "My Shipments",
    audience: { roles: ["partner"] },
    summary: "Track shipments linked to your account.",
    actions: [
      {
        label: "View a shipment's timeline",
        steps: [
          "Open the My Shipments tab.",
          "Select a shipment row to open its detail view, which shows a status timeline and a message thread for that shipment.",
        ],
      },
    ],
  },
  {
    id: "partner-messages",
    group: "Partner portal",
    title: "Messages",
    audience: { roles: ["partner"] },
    summary: "Message Highland Cargo about your shipments.",
    actions: [{ label: "Send a message", steps: ["Open the Messages tab, write your message, and select Send."] }],
  },
  {
    id: "partner-profile",
    group: "Partner portal",
    title: "Profile",
    audience: { roles: ["partner"] },
    summary: "Edit your display name.",
    actions: [{ label: "Update your name", steps: ["Open the Profile tab, edit your full name, and save."] }],
  },
  {
    id: "partner-catalogs",
    group: "Partner portal",
    title: "Partner catalogs",
    audience: { roles: ["partner"] },
    summary: "Browse region-specific product catalogs.",
    body: ["From your dashboard Overview, select Explore Partner Catalogs to browse products filtered to Dubai, China or UK."],
  },

  // ------------------------------------------------------------------
  // Admin console -- orientation
  // ------------------------------------------------------------------
  {
    id: "admin-orientation",
    group: "Admin console",
    title: "Finding your way around",
    audience: "adminArea",
    summary: "How the admin console is organized.",
    body: [
      "The admin console lives under /admin behind a left sidebar. You only see the sections your role has permission for -- everything below this page is filtered the same way.",
      "Each module follows the same pattern: a list view with a table, an Add/Create button that opens a form panel, a pencil icon to edit a row, and a trash icon to delete it. Once you've learned one module, you've learned most of them.",
    ],
  },
  {
    id: "admin-roles-concept",
    group: "Admin console",
    title: "How permissions work",
    audience: "adminArea",
    summary: "Why you see the modules you see.",
    body: [
      "Every staff role (except Admin) has a permissions matrix stored on a named role record: for each module (Products, Orders, Invoices, Inventory, ...) it lists which actions -- view, create, edit, delete -- are allowed. Admin always has full access regardless of the matrix.",
      "If a module you need is missing from your sidebar, ask an Admin to grant it from User Management > Roles.",
    ],
  },

  // ------------------------------------------------------------------
  // Catalog
  // ------------------------------------------------------------------
  {
    id: "admin-categories",
    group: "Catalog",
    title: "Categories",
    audience: { module: "products" },
    summary: "Organize the product catalog into categories.",
    actions: [
      { label: "View categories", steps: ["Go to Catalog > Categories to see every category and its product count."] },
      { label: "Create a category", steps: ["Select Add Category.", "Enter a name and description, then Save."] },
      { label: "Edit a category", steps: ["Select the pencil icon on a category row, change the fields, and Save."] },
      { label: "Delete a category", steps: ["Select the trash icon on a category row and confirm."] },
      { label: "See what's in a category", steps: ["Select a category to drill into the products assigned to it."] },
    ],
  },
  {
    id: "admin-products",
    group: "Catalog",
    title: "Products",
    audience: { module: "products" },
    summary: "The full catalog across all suppliers and regions.",
    actions: [
      { label: "View products", steps: ["Go to Catalog > Products. Filter by category using the dropdown; results are paginated."] },
      {
        label: "Create a product",
        steps: [
          "Select Add Product.",
          "Enter name, price, description, category, region (Dubai/China/UK), and link a partner and/or supplier.",
          "Upload up to 4 images.",
          "Save.",
        ],
      },
      { label: "Edit a product", steps: ["Select the pencil icon on a product row, update any field or image, and Save."] },
      { label: "Delete a product", steps: ["Select the trash icon on a product row and confirm. This also removes its images from storage."] },
    ],
  },

  // ------------------------------------------------------------------
  // Shipments
  // ------------------------------------------------------------------
  {
    id: "admin-shipments",
    group: "Shipments",
    title: "Shipments",
    audience: { module: "shipments" },
    summary: "Track freight from sourcing through to delivery.",
    body: [
      "Status pipeline: Pending Payment → Payment Confirmed → Sourcing from Supplier → In Transit to Kenya → At Kenya Warehouse → Out for Delivery → Delivered.",
    ],
    actions: [
      { label: "View shipments", steps: ["Go to Shipments. Each row shows the linked order, partner, supplier, product, route and current status."] },
      {
        label: "Create a shipment",
        steps: ["Select Add Shipment.", "Set the order, product, partner, supplier, source/destination locations and tracking number.", "Save."],
      },
      { label: "Update a shipment", steps: ["Select the pencil icon, move it to its next status or edit any field, and Save."] },
      { label: "Delete a shipment", steps: ["Select the trash icon on a shipment row and confirm."] },
    ],
    notes: ["Every status change is timestamped on the shipment's timeline, visible to the customer/partner on their side."],
  },

  // ------------------------------------------------------------------
  // Sales
  // ------------------------------------------------------------------
  {
    id: "admin-quotations",
    group: "Sales",
    title: "Quotations",
    audience: { module: "quotations" },
    summary: "Price a freight request before it becomes a paying order.",
    actions: [
      { label: "View quotations", steps: ["Go to Sales > Quotations."] },
      {
        label: "Create a quotation",
        steps: [
          "Select New Quotation.",
          "Choose the customer, optionally an origin warehouse, destination, cargo description, weight/volume, mode (air/sea).",
          "Set status and a quoted amount.",
          "Save -- a quotation number is generated automatically.",
        ],
      },
      { label: "Edit a quotation", steps: ["Select the pencil icon, update fields (e.g. move status to Quoted once priced), and Save."] },
      { label: "Delete a quotation", steps: ["Select the trash icon and confirm."] },
      {
        label: "Convert a quotation to an order",
        steps: ["Once a quotation's status is Quoted, select the convert (arrow) icon on its row.", "This creates a new Order for the same customer and amount, and marks the quotation Accepted."],
      },
    ],
  },
  {
    id: "admin-orders",
    group: "Sales",
    title: "Orders",
    audience: { module: "orders" },
    summary: "Line-item sales orders -- the core sales-to-cash record.",
    actions: [
      { label: "View orders", steps: ["Go to Sales > Orders. Each row shows order number, customer, item count, total and status."] },
      {
        label: "Create an order",
        steps: [
          "Select New Order.",
          "Choose the customer and status.",
          "Add one or more line items (description, quantity, unit price) with Add Item; remove a line with its trash icon.",
          "Optionally set a discount amount.",
          "Save -- an order number and totals are generated automatically.",
        ],
      },
      { label: "Edit an order", steps: ["Select the pencil icon to change status, items or discount, then Save."] },
      { label: "Delete an order", steps: ["Select the trash icon and confirm."] },
    ],
  },
  {
    id: "admin-discounts",
    group: "Sales",
    title: "Discounts",
    audience: { module: "orders" },
    summary: "Promo codes usable against orders/invoices.",
    actions: [
      { label: "View discounts", steps: ["Go to Sales > Discounts."] },
      { label: "Create a discount", steps: ["Select New Discount.", "Enter a code, type (percentage or fixed) and value.", "Save."] },
      { label: "Edit a discount", steps: ["Select the pencil icon, update, and Save."] },
      { label: "Delete a discount", steps: ["Select the trash icon and confirm."] },
    ],
  },
  {
    id: "admin-delivery-notes",
    group: "Sales",
    title: "Delivery notes",
    audience: { module: "orders" },
    summary: "Proof-of-delivery records for the last mile.",
    actions: [
      { label: "View delivery notes", steps: ["Go to Sales > Delivery Notes."] },
      {
        label: "Create a delivery note",
        steps: ["Select New Delivery Note.", "Choose the order, who received it, and the delivery date/time.", "Save."],
      },
      { label: "Edit a delivery note", steps: ["Select the pencil icon, update, and Save."] },
      { label: "Delete a delivery note", steps: ["Select the trash icon and confirm."] },
    ],
  },

  // ------------------------------------------------------------------
  // Billing
  // ------------------------------------------------------------------
  {
    id: "admin-invoices",
    group: "Billing",
    title: "Invoices",
    audience: { module: "invoices" },
    summary: "Bill customers and take card payment via Paystack.",
    actions: [
      { label: "View invoices", steps: ["Go to Billing > Invoices."] },
      {
        label: "Create an invoice",
        steps: ["Select New Invoice.", "Choose the customer, optionally link an order, set the amount, due date and status.", "Save -- an invoice number is generated automatically."],
      },
      { label: "Edit an invoice", steps: ["Select the pencil icon, update, and Save."] },
      { label: "Delete an invoice", steps: ["Select the trash icon and confirm."] },
      {
        label: "Take payment on an invoice",
        steps: [
          "On an invoice with status Sent or Overdue, select the card icon (Pay with Paystack).",
          "This opens the Paystack checkout for the outstanding balance; on success the invoice is marked Paid automatically via webhook.",
        ],
      },
    ],
    notes: ["Card payments require a PAYSTACK_SECRET_KEY to be configured -- without it, payment initiation will show an error."],
  },
  {
    id: "admin-payments",
    group: "Billing",
    title: "Payments",
    audience: { module: "payments" },
    summary: "The payment ledger -- card and manual.",
    actions: [
      { label: "View payments", steps: ["Go to Billing > Payments to see every recorded payment, its method and status."] },
      {
        label: "Record a manual payment",
        steps: ["Select Record Payment.", "Choose the invoice, enter the amount received, and choose Cash or Bank Transfer.", "Save -- the invoice's paid amount and status update automatically."],
      },
    ],
    notes: ["Paystack (card) payments are recorded automatically by the webhook and can't be entered manually here."],
  },

  // ------------------------------------------------------------------
  // Purchasing
  // ------------------------------------------------------------------
  {
    id: "admin-purchases",
    group: "Purchasing",
    title: "Purchases",
    audience: { module: "purchases" },
    summary: "Buying goods from suppliers to fulfil orders.",
    actions: [
      { label: "View purchases", steps: ["Go to Purchasing > Purchases."] },
      {
        label: "Create a purchase order",
        steps: [
          "Select New Purchase.",
          "Choose the supplier and receiving warehouse.",
          "Add line items -- pick an existing product or type a custom line, with quantity and unit cost.",
          "Save as Pending.",
        ],
      },
      {
        label: "Receive a purchase",
        steps: ["Edit the purchase and change its status to Received.", "This automatically posts stock-in movements for every line item into the chosen warehouse."],
      },
      { label: "Delete a purchase", steps: ["Select the trash icon and confirm."] },
    ],
  },

  // ------------------------------------------------------------------
  // Inventory
  // ------------------------------------------------------------------
  {
    id: "admin-stock-on-hand",
    group: "Inventory",
    title: "Stock on hand",
    audience: { module: "inventory" },
    summary: "Current quantity of every product at every warehouse.",
    body: ["Read-only. Calculated automatically from the inventory movements ledger (purchases received, transfers, adjustments, and sales)."],
  },
  {
    id: "admin-stock-transfers",
    group: "Inventory",
    title: "Stock transfers",
    audience: { module: "inventory" },
    summary: "Move stock between warehouses.",
    actions: [
      { label: "View transfers", steps: ["Go to Inventory > Stock Transfers."] },
      {
        label: "Create a transfer",
        steps: ["Select New Transfer.", "Choose a source and destination warehouse (they must differ) and add product/quantity lines.", "Save as Pending."],
      },
      {
        label: "Complete a transfer",
        steps: ["Edit the transfer and set status to Completed.", "This posts a stock-out at the source warehouse and a matching stock-in at the destination."],
      },
      { label: "Delete a transfer", steps: ["Select the trash icon and confirm."] },
    ],
  },
  {
    id: "admin-stock-adjustments",
    group: "Inventory",
    title: "Stock adjustments",
    audience: { module: "inventory" },
    summary: "Correct stock counts -- damage, loss, stock-take corrections.",
    actions: [
      { label: "View adjustments", steps: ["Go to Inventory > Stock Adjustments."] },
      {
        label: "Create an adjustment",
        steps: ["Select New Adjustment.", "Choose the warehouse and a reason.", "Add product lines with a signed quantity change (negative for losses, positive for found stock).", "Save as Pending."],
      },
      {
        label: "Approve an adjustment",
        steps: ["Edit the adjustment and set status to Approved.", "This posts the quantity change to stock on hand immediately."],
      },
      { label: "Delete an adjustment", steps: ["Select the trash icon and confirm."] },
    ],
  },

  // ------------------------------------------------------------------
  // Warehouses
  // ------------------------------------------------------------------
  {
    id: "admin-warehouses",
    group: "Warehouses",
    title: "Warehouses",
    audience: { module: "warehouses" },
    summary: "Overseas sourcing hubs and local warehouses.",
    actions: [
      { label: "View warehouses", steps: ["Go to Warehouses."] },
      { label: "Add a warehouse", steps: ["Select Add Warehouse.", "Enter name, country, city, type (overseas/local), address and contact.", "Save."] },
      { label: "Edit a warehouse", steps: ["Select the pencil icon, update, and Save."] },
      { label: "Delete a warehouse", steps: ["Select the trash icon and confirm."] },
    ],
  },

  // ------------------------------------------------------------------
  // Expenses
  // ------------------------------------------------------------------
  {
    id: "admin-expenses",
    group: "Expenses",
    title: "Expenses",
    audience: { module: "expenses" },
    summary: "Operational costs -- fuel, customs duty, rent, commissions.",
    actions: [
      { label: "View expenses", steps: ["Go to Expenses."] },
      {
        label: "Record an expense",
        steps: ["Select Record Expense.", "Enter description, amount and date; optionally pick a category and warehouse.", "Save."],
      },
      {
        label: "Add a new expense category on the fly",
        steps: ["While recording an expense, type a new category name in the New category field and select the + button -- it's created and selected immediately."],
      },
      { label: "Edit an expense", steps: ["Select the pencil icon, update, and Save."] },
      { label: "Delete an expense", steps: ["Select the trash icon and confirm."] },
    ],
  },

  // ------------------------------------------------------------------
  // Contacts
  // ------------------------------------------------------------------
  {
    id: "admin-customers",
    group: "Contacts",
    title: "Customers",
    audience: { module: "contacts" },
    summary: "Buyers -- linked to quotations, orders and invoices.",
    actions: [
      { label: "View customers", steps: ["Go to Contacts > Customers."] },
      { label: "Add a customer", steps: ["Select Add Customer.", "Enter name, email, phone, address and an optional group.", "Save."] },
      { label: "Edit a customer", steps: ["Select the pencil icon, update, and Save."] },
      { label: "Delete a customer", steps: ["Select the trash icon and confirm."] },
    ],
  },
  {
    id: "admin-partners",
    group: "Contacts",
    title: "Partners",
    audience: { module: "contacts" },
    summary: "Regional reseller accounts.",
    actions: [
      { label: "View partners", steps: ["Go to Contacts > Partners."] },
      { label: "Add a partner", steps: ["Select Add Partner.", "Enter name, country, contact email and phone.", "Save."] },
      { label: "Edit a partner", steps: ["Select the pencil icon, update, and Save."] },
      { label: "Delete a partner", steps: ["Select the trash icon and confirm."] },
    ],
    notes: ["Partners can also self-serve most of this via their own onboarding flow -- see Partner portal."],
  },
  {
    id: "admin-suppliers",
    group: "Contacts",
    title: "Suppliers",
    audience: { module: "contacts" },
    summary: "Overseas vendor accounts -- includes verification.",
    actions: [
      { label: "View suppliers", steps: ["Go to Contacts > Suppliers -- shows onboarding status and step."] },
      { label: "Add a supplier", steps: ["Select Add Supplier, enter details, and Save."] },
      { label: "Edit a supplier", steps: ["Select the pencil icon, update, and Save."] },
      { label: "Delete a supplier", steps: ["Select the trash icon and confirm."] },
      {
        label: "Verify or reject a supplier",
        steps: ["For a supplier with status Pending Verification, select Approve or Reject.", "This updates their onboarding_status, unlocking (or blocking) full supplier-portal access."],
      },
    ],
  },
  {
    id: "admin-agents",
    group: "Contacts",
    title: "Agents",
    audience: { module: "contacts" },
    summary: "Customs brokers, freight agents and trucking partners.",
    actions: [
      { label: "View agents", steps: ["Go to Contacts > Agents."] },
      { label: "Add an agent", steps: ["Select Add Agent.", "Enter name, type (customs broker / freight agent / trucking partner / other), contact email, phone and country.", "Save."] },
      { label: "Edit an agent", steps: ["Select the pencil icon, update, and Save."] },
      { label: "Delete an agent", steps: ["Select the trash icon and confirm."] },
    ],
  },
  {
    id: "admin-contact-groups",
    group: "Contacts",
    title: "Contact groups",
    audience: { module: "contacts" },
    summary: "Tags for segmenting customers (e.g. VIP, Wholesale).",
    actions: [
      { label: "View groups", steps: ["Go to Contacts > Contact Groups."] },
      { label: "Create a group", steps: ["Select New Group, enter a name and description, and Save."] },
      { label: "Edit a group", steps: ["Select the pencil icon, update, and Save."] },
      { label: "Delete a group", steps: ["Select the trash icon and confirm."] },
    ],
  },

  // ------------------------------------------------------------------
  // User management
  // ------------------------------------------------------------------
  {
    id: "admin-users",
    group: "User management",
    title: "Users",
    audience: { module: "users" },
    summary: "Every account on the platform and its role.",
    actions: [
      { label: "View users", steps: ["Go to User Management > Users."] },
      {
        label: "Invite a new user",
        steps: [
          "Select Invite User.",
          "Enter their email, optional name, and choose a role.",
          "If the role is Partner or Supplier, optionally link them to an existing partner/supplier record.",
          "Save -- they receive an email invite to set up sign-in.",
        ],
      },
      { label: "Edit a user", steps: ["Select the pencil icon on a user row to change their name, role or linked partner/supplier."] },
      { label: "Remove a user", steps: ["Select the trash icon on a user row and confirm."] },
    ],
  },
  {
    id: "admin-roles",
    group: "User management",
    title: "Roles & permissions",
    audience: { module: "users" },
    summary: "Define what each operational role can see and do.",
    actions: [
      { label: "View roles", steps: ["Go to User Management > Roles."] },
      {
        label: "Create a custom role",
        steps: ["Select Create Role.", "Name it and toggle view/create/edit/delete for each module.", "Save."],
      },
      { label: "Edit a role's permissions", steps: ["Select the pencil icon on a role, toggle the permission chips, and Save."] },
      { label: "Delete a role", steps: ["Select the trash icon -- only available on non-system roles."] },
    ],
    notes: ["The 8 built-in roles (admin, manager, accountant, warehouse_staff, sales_agent, cashier, supplier, partner) are marked system roles and can't be deleted, but their permissions can still be edited."],
  },

  // ------------------------------------------------------------------
  // Reports
  // ------------------------------------------------------------------
  {
    id: "admin-reports",
    group: "Reports",
    title: "Reports",
    audience: { module: "reports" },
    summary: "Revenue, spend, expenses and profit/loss at a glance.",
    body: [
      "Go to Reports for four stat cards (revenue collected, purchase spend, expenses, net profit), a chart of orders by status, a chart of top suppliers by spend, and an expenses-by-category breakdown. Everything here is read-only and calculated live from the underlying records.",
    ],
  },

  // ------------------------------------------------------------------
  // HRM
  // ------------------------------------------------------------------
  {
    id: "admin-hrm-employees",
    group: "HRM",
    title: "Employees",
    audience: { module: "hrm" },
    summary: "Your staff roster.",
    actions: [
      { label: "View employees", steps: ["Go to HRM > Employees tab."] },
      {
        label: "Add an employee",
        steps: ["Select Add Employee.", "Enter name, contact info, department, designation, employment type, salary, hire date and status.", "Save."],
      },
      { label: "Edit an employee", steps: ["Select the pencil icon, update, and Save."] },
      { label: "Remove an employee", steps: ["Select the trash icon and confirm."] },
    ],
  },
  {
    id: "admin-hrm-attendance",
    group: "HRM",
    title: "Attendance",
    audience: { module: "hrm" },
    summary: "Daily check-in/check-out.",
    actions: [
      { label: "Check an employee in", steps: ["Go to HRM > Attendance tab.", "Select Check In next to their name -- this records today's check-in time."] },
      { label: "Check an employee out", steps: ["Select Check Out next to a checked-in employee to record their check-out time."] },
    ],
  },
  {
    id: "admin-hrm-leave",
    group: "HRM",
    title: "Leave",
    audience: { module: "hrm" },
    summary: "Leave requests and approvals.",
    actions: [
      { label: "Request leave for an employee", steps: ["Go to HRM > Leave tab.", "Choose the employee, leave type, start and end date, then select Request."] },
      { label: "Approve or reject a request", steps: ["On a Pending request, select Approve or Reject."] },
    ],
  },
  {
    id: "admin-hrm-payroll",
    group: "HRM",
    title: "Payroll",
    audience: { module: "hrm" },
    summary: "Monthly pay runs per employee.",
    actions: [
      { label: "Add a payroll entry", steps: ["Go to HRM > Payroll tab.", "Choose the employee and period month, enter basic salary and deductions, then Add -- net pay is calculated automatically."] },
      { label: "Mark an entry paid", steps: ["On a Pending entry, select Mark Paid."] },
    ],
  },
  {
    id: "admin-hrm-setup",
    group: "HRM",
    title: "Setup",
    audience: { module: "hrm" },
    summary: "Departments, designations, holidays and leave types.",
    body: ["Go to HRM > Setup tab for four small lists. Each has an inline add row and a delete icon per entry: Departments, Designations (optionally linked to a department), Holidays (name + date), and Leave Types (name + days allowed per year)."],
  },

  // ------------------------------------------------------------------
  // Settings
  // ------------------------------------------------------------------
  {
    id: "admin-settings",
    group: "Settings",
    title: "Settings",
    audience: { module: "settings" },
    summary: "Business, invoicing and tax configuration.",
    actions: [
      { label: "Update business settings", steps: ["Go to Settings.", "Edit company name, address, phone, email and currency, then Save Business Settings."] },
      { label: "Update invoice settings", steps: ["Edit invoice prefix, default due days, and footer note, then Save Invoice Settings."] },
      { label: "Add a tax rate", steps: ["Enter a name (e.g. VAT) and rate percentage, then select the + button."] },
      { label: "Remove a tax rate", steps: ["Select the trash icon next to a tax rate."] },
    ],
  },

  // ------------------------------------------------------------------
  // POS
  // ------------------------------------------------------------------
  {
    id: "admin-pos",
    group: "POS terminal",
    title: "POS terminal",
    audience: { module: "pos" },
    summary: "Counter checkout for walk-in customers.",
    actions: [
      { label: "Open a register", steps: ["Go to /pos.", "Choose a warehouse/location, name the register, enter the opening cash float, and select Open Register."] },
      {
        label: "Ring up a sale",
        steps: [
          "Search or browse products and select a product tile to add it to the cart.",
          "Adjust quantity with the +/- controls, or remove a line with the trash icon.",
          "Select Charge Cash to complete the sale.",
        ],
      },
      { label: "Close the register", steps: ["Enter the counted closing cash amount in the header field and select Close Register."] },
    ],
    notes: [
      "A completed sale automatically creates an order, a paid invoice, a cash payment record, and posts stock-out movements for every item -- it shows up in Sales > Orders and Billing > Invoices like any other sale.",
      "The POS terminal currently accepts cash only; card payment at the counter isn't available yet.",
    ],
  },

  // ------------------------------------------------------------------
  // Reference
  // ------------------------------------------------------------------
  {
    id: "roles-matrix",
    group: "Reference",
    title: "Full roles & permissions matrix",
    audience: "adminArea",
    summary: "What each built-in role can do, module by module.",
    body: ["Admin has full access to every module regardless of this table. The other seven built-in roles are seeded with the permissions below; an Admin can adjust any of them from User Management > Roles."],
    table: {
      headers: ["Role", "Full access modules", "View-only modules"],
      rows: [
        ["Manager", "Products, Shipments, Quotations, Orders, Purchases, Warehouses, HRM", "Invoices, Payments, Expenses, Contacts, Reports, POS (create)"],
        ["Accountant", "Invoices, Expenses", "Quotations, Orders, Purchases, Reports; can record Payments"],
        ["Warehouse staff", "Inventory", "Products (edit), Shipments (edit), Orders, Purchases, Reports; edits Warehouses"],
        ["Sales agent", "Quotations, Orders, Contacts", "Shipments (edit), Invoices, Reports"],
        ["Cashier", "POS", "Orders (create), Invoices (create); can record Payments"],
        ["Supplier", "Their own supplier-portal data only (products, shipments, team, messages)", "--"],
        ["Partner", "Their own partner-portal data only (shipments, messages, profile)", "--"],
      ],
    },
  },
];

export function docSectionVisible(section, profile, rolesByName, canViewModule) {
  if (!profile) return false;
  if (section.audience === "all") return true;
  if (section.audience === "adminArea") {
    return Boolean(profile.is_admin) || ADMIN_AREA_ROLES.includes(profile.role);
  }
  if (section.audience?.roles) {
    const role = profile.role || "customer";
    if (profile.is_admin && section.audience.roles.includes("admin")) return true;
    return section.audience.roles.includes(role);
  }
  if (section.audience?.module) {
    return canViewModule(profile, rolesByName, section.audience.module);
  }
  return false;
}

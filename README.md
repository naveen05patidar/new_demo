# README for Project Components

This README provides an overview of the three main applications developed as part of this project. Each application showcases unique functionality and leverages modern tools and libraries.

## 1. Insight Medical

**Description**: Insight Medical is a user-centric application designed with a dynamic interface supporting both dark and light themes. It aims to enhance user experience in medical-related workflows.

**Key Features**:
- **Theme Support**: Implements dark and light themes to cater to user preferences.
- **Technologies Used**:
  - **Tailwind CSS**: For responsive and modern styling.
  - **Redux Toolkit**: To manage state efficiently and ensure seamless interactions.

---

## 2. MLB (My LPG Book)

**Description**: MLB is an application designed to manage LPG-related workflows efficiently, containing multiple files with specific functionalities.

**Key Features**:

1. **Purchase Report File**:
   - Contains a table with an item list.
   - Supports downloading reports in **Excel** and **PDF** formats.

2. **Quotations.js File**:
   - Offers a wide range of functionalities, including:
     - Add product, list, view, print, and delete with pagination.
     - Complex **add functionality**:
       - Includes numerous input fields, many of which depend on each other’s values.
       - Array object-based add functionality with delete options.
       - Multiple API integrations for data fetching.
       - Complex calculations with proper validations.
       - Extensive validations during the product addition process.

3. **TransactionsSlice.js File**:
   - Manages all list APIs, their thunks, and associated states.

---

## 3. Shiloh Bridal

**Description**: Shiloh Bridal is an application designed to manage bridal product workflows with robust functionalities for handling product-related data and actions.

**Key Features**:

1. **Index.js File**:
   - Displays a list with proper pagination.
   - Provides view and delete functionalities for each list item.

2. **ProductAdd.js File**:
   - Supports three modes: add, edit, and view.
     - In **view** mode, all fields are disabled.
     - In **edit** mode, all fields are pre-filled for modification.
   - Contains numerous fields with comprehensive validation.
   - Includes dynamic behaviors where fields depend on each other’s values.
   - Features array object-based functionality with delete options.
   - Integrates multiple APIs for data handling.
   - Performs complex calculations with proper validations during product addition and editing.

3. **DataSlice.js File**:
   - Manages the list and related functionalities.
   - Implements `createAsyncThunk` for operations like updates and status changes.


import { App } from 'vue';
import LiveSearch from './LiveSearch.vue';
import CustomerResult from './results/CustomerResult.vue';
import ProductResult from './results/ProductResult.vue';
import UserResult from './results/UserResult.vue';
import CreateNewModal from './CreateNewModal.vue';
import CustomerForm from './forms/CustomerForm.vue';
import ProductForm from './forms/ProductForm.vue';
import UserForm from './forms/UserForm.vue';

// Export components
export {
  LiveSearch,
  CustomerResult,
  ProductResult,
  UserResult,
  CreateNewModal,
  CustomerForm,
  ProductForm,
  UserForm
};

// Define plugin
export default {
  install(app: App) {
    app.component('MxLiveSearch', LiveSearch);
    app.component('MxCustomerResult', CustomerResult);
    app.component('MxProductResult', ProductResult);
    app.component('MxUserResult', UserResult);
    app.component('MxCreateNewModal', CreateNewModal);
    app.component('MxCustomerForm', CustomerForm);
    app.component('MxProductForm', ProductForm);
    app.component('MxUserForm', UserForm);
  }
};
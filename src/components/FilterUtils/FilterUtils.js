export const applyFilters = (filters, products) => {
    return products.filter(product => 
      Object.keys(filters).every(filterKey =>
        !filters[filterKey] || product[filterKey]?.toString().toLowerCase().includes(filters[filterKey].toLowerCase())
      )
    );
  };
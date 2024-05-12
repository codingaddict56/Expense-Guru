import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { act } from 'react-dom/test-utils'; 
import './Categories.scss';
import { addCategoryAPI } from "../../utils/StaticData";
import { fetchCategoriesAPI } from "../../utils/StaticData";



function Categories() {
  const [categories, setCategories] = useState(null); 
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return; 
    try {
      let userId=1;
      await axios.post(addCategoryAPI, { name, description, userId });
      fetchCategories();
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error adding categories:', error);
    }
  };

   
   const fetchCategories = async () => {
    try {
      const response = await axios.get(fetchCategoriesAPI);
      await act(async () => {
        setCategories(response.data.categories);
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
    useEffect(() => {
    console.log('Fetching categories...');
    fetchCategories();
  }, []);

  return (
    <div>
    
      <h2>Add Category</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Description:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button type="submit">Add Category</button>
      </form>

      <h2>Categories</h2>
      {Array.isArray(categories) && categories.length > 0 ? (
  categories.map((category, index) => (
    <li key={index}>
      <strong>Name:</strong> {category.name}, <strong>Description:</strong> {category.description}
    </li>
  ))
) : (
  <li>No categories found</li>
)}
      
    </div>
  );
}

export default Categories;
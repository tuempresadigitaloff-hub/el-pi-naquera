
(()=>{try{
 const data=JSON.parse(localStorage.getItem('elpi_catalog')||'{}');
 const nodes=[...document.querySelectorAll('.menu-section .item')];
 nodes.forEach((item,index)=>{
  if((data.deleted||[]).includes(String(index))){item.remove();return}
  const edit=data.items?.[String(index)];if(!edit)return;
  const name=item.querySelector('.name'),price=item.querySelector('.price'),desc=item.querySelector('.desc');
  if(name&&edit.name!==undefined)name.textContent=edit.name;
  if(price&&edit.price!==undefined)price.textContent=edit.price?edit.price+' €':'';
  if(desc&&edit.desc!==undefined)desc.textContent=edit.desc;
  else if(edit.desc&&!desc){const d=document.createElement('div');d.className='desc';d.textContent=edit.desc;item.append(d)}
 });
 (data.added||[]).forEach(x=>{
  const sections=[...document.querySelectorAll('.menu-section')];
  const section=sections.find(s=>s.querySelector('h2')?.textContent.trim()===x.category);
  if(!section)return;
  const item=document.createElement('article');item.className='item';
  const top=document.createElement('div');top.className='item-top';
  const name=document.createElement('span');name.className='name';name.textContent=x.name;top.append(name);
  if(x.price){const price=document.createElement('span');price.className='price';price.textContent=x.price+' €';top.append(price)}
  item.append(top);if(x.desc){const desc=document.createElement('div');desc.className='desc';desc.textContent=x.desc;item.append(desc)}
  section.querySelector('.items')?.append(item);
 });
}catch(e){console.warn('No se han podido aplicar los cambios locales de la carta.',e)}})();

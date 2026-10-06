export async function downscalePhoto(file:File):Promise<string>{
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>15*1024*1024)throw new Error('Pilih foto JPEG, PNG, atau WebP hingga 15 MB.');
 const bitmap=await createImageBitmap(file);
 try{
  const scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));
  const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
  const context=canvas.getContext('2d');if(!context)throw new Error('Browser tidak dapat memproses foto.');
  context.fillStyle='#ffffff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(bitmap,0,0,canvas.width,canvas.height);
  for(const quality of [.85,.7,.55]){const data=canvas.toDataURL('image/jpeg',quality);if(data.length<=750000)return data;}
  throw new Error('Foto masih terlalu besar. Pangkas atau kecilkan foto terlebih dahulu.');
 }finally{bitmap.close();}
}

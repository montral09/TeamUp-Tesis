using backend.Data_Access.VO.Data;
using backend.Logic.Entities;
using System.Collections.Generic;

namespace backend.Logic.Converters.VOToEntity
{
    public static class VOImageToImageConverter
    {
        public static Image Convert(VOImage voImage)
        {
            Image image = new Image();
            image.Base64String = voImage.Base64String;
            image.Extension = voImage.Extension;
            return image;
        }

        public static List<Image> Convert (List<VOImage> voImages)
        {
            List<Image> images = new List<Image>();
            foreach (var image in voImages)
            {
                images.Add(Convert(image));
            }
            return images;
        }
    }
}

import React from 'react'
import { FILE_SOCIAL_URL, IMG_EMPLOYEE_URL } from '~/configs';
import { AvatarImage } from '~/views/container/Social/Components/'
export const mapOptions = (items, nameData = 'item') => {
  return items
    ? items.map(item => {
      const option = {
        value: item?.id ?? item?.value,
        label: item?.name ?? item?.label,
      };
      if (item[nameData] && item[nameData].length) {
        option.children = mapOptions(item[nameData], nameData);
      }
      return option;
    })
    : [];
};

export const mapDropdown = items => {
  return items
    ? items?.map(item => ({
      value: item.id || item.key || item._id,
      label: item.name || item.title
    }))
    : [];
};

export const mapDataChartServiceProvider = items => {
  let labels = [],
    data = [];
  items.forEach(function (item) {
    labels.push(item.name);
    data.push(item.value);
  });
  return {
    labels: labels,
    data: data
  };
};

export const mapDataChartByMonth = items => {
  let labels = [],
    data = [];
  items.forEach(function (item) {
    labels.push(['T' + item.month, item.year]);
    data.push(item.value);
  });
  return {
    labels: labels,
    data: data
  };
};


export const mapOptionsByEmployee = (items, custom = false) => {
  const style = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '180px'
  }
  return items
    ? items.map(item => ({
      ...(custom ? { value: item?._id } : { value: item?.id }),
      label: <div className="user d-flex align-items-center">
        <div className="user__avt mr-1">
          <AvatarImage url={!!item?.totalUsers ? `${FILE_SOCIAL_URL}/` : IMG_EMPLOYEE_URL} avatar={item?.avatar} name={item?.name || item?.fullName} />
        </div>
        <div className="user__info">
          <div style={style} title={(item?.name || item?.fullName) ?? ''} className="user__name">{(item?.name || item?.fullName) ?? ''}</div>
          {!custom && <div style={style} title={item?.positionName ?? ''} className="user__department">{item?.positionName ?? ''}</div>}
        </div>
      </div>
    }))
    : [];
}

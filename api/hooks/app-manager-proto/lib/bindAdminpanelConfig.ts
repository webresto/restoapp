

let models = {
  settings: {

    title: "Settings",
    model: "settings",
    icon: "cog",
    fields: {
      id: false,
      key: "Key",
      name: "Name",
      description: "Description",
      tooltip: "Tooltip",
      value: "Value",
      defaultValue: "Default value",
      type: "Type",
      jsonSchema: "JSON Schema",
      readOnly: "Read only",
      uiSchema: "UI Schema",
      module: "Module",
      createdAt: false,
      updatedAt: false,
      isRequired: "Is required"
    },

    list: {
      fields: {
        id: false,
        defaultValue: false,
        description: false,
        tooltip: false,
        uiSchema: false,
        readOnly: false,
        isRequired: false,
        jsonSchema: false,
        type: false,
        value: {
          displayModifier(v) {
              sails.log.debug(v)
              if(typeof v === "object" && v !== null && Object.keys(v).length > 5) {
                return "long object"
              }
              return v
          },
        }
      },
    },

    add: {
      fields: {
        value: {
          title: "Key",
          type: "json",
        },
      },
    },

    edit: {
      fields: {
        description: {
          title: "Описание",
          type: "longtext",
          disabled: true,
        },
        key: {
          disabled: true,
        },
        value: {
          title: "Value",
          type: "json",
        }
      }
    }
  }
}

export default function bindAdminpanel () {
  // sails.on('Adminpanel:afterHook:loaded', async ()=>{
  //   ConfigHelper.addModelConfig(models)
  // })
}






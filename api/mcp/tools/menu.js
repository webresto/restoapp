'use strict';

/**
 * Public tools — menu catalogue.
 * Mirrors the GraphQL resolvers: menu, group, dish, dishes.
 */
module.exports = function register(mcp) {

  // GET menu groups (top-level navigation) — mirrors GQL `menu`
  mcp.registerTool({
    name: 'menu',
    description: 'Returns top-level menu groups for navigation. Filters by worktime, enabled state, and visibility. Mirrors the GraphQL `menu` query.',
    mode: 'public',
    schema: {
      type: 'object',
      properties: {
        concept: {
          type: 'string',
          description: 'Concept name to filter groups. Defaults to "origin".',
          example: 'origin',
        },
        topLevelGroupId: {
          type: 'string',
          description: 'ID of the top-level group to start from. Optional.',
          example: '<groupId>',
        },
      },
    },
    handler: async ({ concept, topLevelGroupId }) => {
      try {
        return await Group.getMenuGroups(concept, topLevelGroupId);
      } catch (error) {
        sails.log.error('MCP > [menu]', error);
        throw error;
      }
    },
  });

  // GET single group with its children and dishes — mirrors GQL `group`
  mcp.registerTool({
    name: 'group',
    description: 'Returns a single menu group with its child groups and dish list. Accepts either an ID or a slug.',
    mode: 'public',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Group ID.',
          example: '<groupId>',
        },
        slug: {
          type: 'string',
          description: 'Group slug (used when ID is not provided).',
          example: 'pizza',
        },
      },
    },
    handler: async ({ id, slug }) => {
      try {
        if (id) {
          const { groups, errors } = await Group.getGroup(id);
          if (Object.keys(errors).length) sails.log.warn('MCP > [group] errors:', errors);
          return groups[0] || null;
        }
        if (slug) {
          const { groups, errors } = await Group.getGroupBySlug(slug);
          if (Object.keys(errors).length) sails.log.warn('MCP > [group] errors:', errors);
          return groups[0] || null;
        }
        throw new Error('Provide either id or slug');
      } catch (error) {
        sails.log.error('MCP > [group]', error);
        throw error;
      }
    },
  });

  // GET dishes for a group — mirrors GQL pattern of querying dishes by parentGroup
  mcp.registerTool({
    name: 'dishes',
    description: 'Returns dishes belonging to a group. Filters out deleted, disabled, and out-of-stock dishes. Populates images. Optionally filter by concept.',
    mode: 'public',
    schema: {
      type: 'object',
      properties: {
        groupId: {
          type: 'string',
          description: 'Parent group ID to fetch dishes from.',
          example: '<groupId>',
        },
        concept: {
          type: 'string',
          description: 'Concept name. Defaults to "origin".',
          example: 'origin',
        },
      },
      required: ['groupId'],
    },
    handler: async ({ groupId, concept }) => {
      try {
        const criteria = { parentGroup: groupId };
        if (concept) criteria.concept = concept;
        return await Dish.getDishes(criteria);
      } catch (error) {
        sails.log.error('MCP > [dishes]', error, { groupId, concept });
        throw error;
      }
    },
  });

  // GET single dish by ID or slug
  mcp.registerTool({
    name: 'dish',
    description: 'Returns a single dish by its ID or slug. Includes images and modifier groups.',
    mode: 'public',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Dish ID.',
          example: '<dishId>',
        },
        slug: {
          type: 'string',
          description: 'Dish slug (used when ID is not provided).',
          example: 'margherita',
        },
      },
    },
    handler: async ({ id, slug }) => {
      try {
        let dish;
        if (id) {
          dish = await Dish.findOne({ id, isDeleted: false, enable: true });
        } else if (slug) {
          dish = await Dish.findOne({ slug, isDeleted: false, enable: true });
        } else {
          throw new Error('Provide either id or slug');
        }

        if (!dish) return null;

        const withModifiers = await Dish.getDishModifiers(dish);
        return { ...dish, modifiers: withModifiers };
      } catch (error) {
        sails.log.error('MCP > [dish]', error, { id, slug });
        throw error;
      }
    },
  });

};
